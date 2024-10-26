import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Howl, Howler } from 'howler';

// Keep your existing imports
import candiesExploration from '/src/assets/audio/Candies_Exploration.mp3?url';
import floralMechas from '/src/assets/audio/Floral_Mechas.mp3?url';
import dubtech from '/src/assets/audio/AI12v3.mp3?url';
import lofiFields from '/src/assets/audio/Lowfi_Fileds.mp3?url';
import suddenAmbush from '/src/assets/audio/AI5.1.mp3?url';
import swampyCreatures from '/src/assets/audio/AI6.mp3?url';
import morphings from '/src/assets/audio/Morphings.mp3?url';

const playlist = [
  { id: 'candies-exploration', title: "Candies Exploration", src: candiesExploration },
  { id: 'floral-mechas', title: "Floral Mechas", src: floralMechas },
  { id: 'dubtech', title: "Dubtech", src: dubtech },
  { id: 'lofi-fields', title: "Lofi Fields", src: lofiFields },
  { id: 'sudden-ambush', title: "Sudden Ambush", src: suddenAmbush },
  { id: 'swampy-creatures', title: "Swampy Creatures", src: swampyCreatures },
  { id: 'morphings', title: "Morphings", src: morphings },
];

const useAudioStore = create(
  persist(
    (set, get) => ({
      // State
      currentTrack: 0,
      isPlaying: false,
      volume: 30,
      isInitialized: false,
      howl: null,
      analyser: null,
      audioContext: null,
      sourceNode: null,
      gainNode: null,  // Add this line
      playlist: playlist,
      loop: true,

      // Initialization
      initializeAudio: async () => {
        const state = get();
        
        try {
          // Always create a fresh AudioContext
          if (state.audioContext) {
            await state.audioContext.close();
          }
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          
          // Set up analyser
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 2048;
          analyser.smoothingTimeConstant = 0.8;

          // Create gain node with initial volume
          const gainNode = audioContext.createGain();
          // Convert initial volume to exponential scale
          const normalizedValue = state.volume / 100;
          const exponentialValue = normalizedValue * normalizedValue;
          gainNode.gain.setValueAtTime(exponentialValue, audioContext.currentTime);

          // Create new Howl instance
          const howl = new Howl({
            src: [state.playlist[state.currentTrack].src],
            autoplay: false,
            html5: true,
            volume: 1, // Set to max since we're using gainNode
            format: ['mp3'],
            onload: function() {
              try {
                const node = this._sounds[0]._node;
                if (!node) return;

                node.crossOrigin = 'anonymous';
                const sourceNode = audioContext.createMediaElementSource(node);
                
                // Connect nodes: source -> gain -> analyser -> destination
                sourceNode.connect(gainNode);
                gainNode.connect(analyser);
                analyser.connect(audioContext.destination);

                set({ sourceNode });
              } catch (error) {
                // Only log errors that aren't about already connected nodes
                if (!error.message.includes('HTMLMediaElement already connected')) {
                  console.error('Error connecting audio nodes:', error);
                }
              }
            },
            onplay: () => set({ isPlaying: true }),
            onpause: () => set({ isPlaying: false }),
            onend: () => {
              const state = get();
              if (state.loop) {
                // If loop is enabled, play the same track again
                state.howl.play();
              } else {
                // If loop is disabled, advance to next track
                const nextIndex = (state.currentTrack + 1) % playlist.length;
                state.setTrack(nextIndex);
              }
            },
            onstop: () => set({ isPlaying: false })
          });

          set({
            howl,
            analyser,
            audioContext,
            gainNode,
            isInitialized: true
          });

          return true;
        } catch (error) {
          console.error('Error initializing audio:', error);
          return false;
        }
      },

      // Playback Controls
      playAudio: async () => {
        const state = get();
        if (!state.howl || state.isPlaying) return false;

        try {
          if (state.audioContext?.state === 'suspended') {
            await state.audioContext.resume();
          }
          
          state.howl.play();
          return true;
        } catch (error) {
          console.error('Error playing audio:', error);
          return false;
        }
      },

      pauseAudio: () => {
        const { howl } = get();
        if (howl) {
          howl.pause();
        }
      },

      // Track Management
      setTrack: async (index) => {
        const state = get();
        if (index === state.currentTrack) return;

        const wasPlaying = state.isPlaying;
        
        if (state.howl) {
          state.howl.stop();
          state.howl.unload();
        }

        set({ currentTrack: index });
        await state.initializeAudio();

        if (wasPlaying) {
          await state.playAudio();
        }
      },

      nextTrack: async () => {
        const state = get();
        try {
          const nextIndex = (state.currentTrack + 1) % playlist.length;
          
          // Complete cleanup
          await state.cleanup();
          
          // Add small delay to ensure cleanup is complete
          await new Promise(resolve => setTimeout(resolve, 50));
          
          set({ currentTrack: nextIndex });
          await state.initializeAudio();
          state.playAudio();
          
        } catch (error) {
          console.error('Error changing track:', error);
        }
      },

      previousTrack: async () => {
        const state = get();
        try {
          const prevIndex = (state.currentTrack - 1 + playlist.length) % playlist.length;
          
          // Complete cleanup
          await state.cleanup();
          
          // Add small delay to ensure cleanup is complete
          await new Promise(resolve => setTimeout(resolve, 50));
          
          set({ currentTrack: prevIndex });
          await state.initializeAudio();
          state.playAudio();
          
        } catch (error) {
          console.error('Error changing track:', error);
        }
      },

      // Volume Control
      setVolume: (newVolume) => {
        const state = get();
        const clampedVolume = Math.min(100, Math.max(0, newVolume));
        
        // Convert percentage to exponential scale for more natural volume control
        const normalizedValue = clampedVolume / 100;
        const exponentialValue = normalizedValue * normalizedValue; // Square for exponential curve
        
        if (state.gainNode) {
          state.gainNode.gain.setValueAtTime(exponentialValue, state.audioContext.currentTime);
        }
        
        set({ volume: clampedVolume });
      },

      // Cleanup
      cleanup: async () => {
        const state = get();
        
        if (state.sourceNode) {
          state.sourceNode.disconnect();
        }

        if (state.gainNode) {
          state.gainNode.disconnect();
        }

        if (state.howl) {
          state.howl.unload();
        }

        if (state.audioContext) {
          await state.audioContext.close();
        }

        set({
          howl: null,
          analyser: null,
          audioContext: null,
          sourceNode: null,
          gainNode: null,
          isInitialized: false,
          isPlaying: false
        });
      },

      getCurrentTrack: () => {
        const { currentTrack, playlist } = get();
        return playlist[currentTrack];
      },
    }),
    {
      name: 'audio-storage',
      version: 1,
      partialize: (state) => ({
        volume: state.volume
      }),
    }
  )
);

export default useAudioStore;
