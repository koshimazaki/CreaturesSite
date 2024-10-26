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
      audioNodes: new Map(),
      playlist: playlist,
      loop: true,

      // Initialization
      initializeAudio: async () => {
        const state = get();
        
        try {
          // Cleanup previous instance
          if (state.howl) {
            state.howl.unload();
          }

          // Create or reuse AudioContext
          const audioContext = state.audioContext || new (window.AudioContext || window.webkitAudioContext)();
          
          // Set up analyser
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 2048;
          analyser.smoothingTimeConstant = 0.8;

          // Create new Howl instance
          const howl = new Howl({
            src: [state.playlist[state.currentTrack].src],
            autoplay: false,
            html5: true,
            volume: state.volume / 100,
            format: ['mp3'],
            onload: function() {
              try {
                const node = this._sounds[0]._node;
                if (!node) return;

                // Only create new audio nodes if needed
                if (!state.audioNodes.has(node)) {
                  node.crossOrigin = 'anonymous';
                  const sourceNode = audioContext.createMediaElementSource(node);
                  sourceNode.connect(analyser);
                  analyser.connect(audioContext.destination);
                  state.audioNodes.set(node, sourceNode);
                }
              } catch (error) {
                console.error('Error connecting audio nodes:', error);
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
        
        // Clear audio nodes before unloading
        state.audioNodes.clear();
        
        if (state.howl) {
          state.howl.stop();
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
          
          // Clear audio nodes before unloading
          state.audioNodes.clear();
          
          if (state.howl) {
            state.howl.unload();
          }

          set({ 
            currentTrack: nextIndex,
            howl: null,
            isPlaying: false
          });
          
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
          
          // Clear audio nodes before unloading
          state.audioNodes.clear();
          
          if (state.howl) {
            state.howl.unload();
          }

          set({ 
            currentTrack: prevIndex,
            howl: null,
            isPlaying: false
          });
          
          await state.initializeAudio();
          state.playAudio();
          
        } catch (error) {
          console.error('Error changing track:', error);
        }
      },

      // Volume Control
      setVolume: (newVolume) => {
        const clampedVolume = Math.min(100, Math.max(0, newVolume));
        Howler.volume(clampedVolume / 100);
        set({ volume: clampedVolume });
      },

      // Cleanup
      cleanup: () => {
        const state = get();
        
        // Clean up audio nodes
        state.audioNodes.forEach((sourceNode) => {
          try {
            sourceNode.disconnect();
          } catch (error) {
            console.warn('Error disconnecting node:', error);
          }
        });

        if (state.howl) {
          state.howl.unload();
        }

        if (state.audioContext) {
          state.audioContext.close();
        }

        set({
          howl: null,
          analyser: null,
          audioContext: null,
          isInitialized: false,
          isPlaying: false,
          audioNodes: new Map()
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
