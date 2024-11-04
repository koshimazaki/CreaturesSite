import { Howl } from 'howler';
import { ActionTypes } from '../SceneMods/types';

// Map ActionTypes to sound categories
const ACTION_TO_SOUND = {
    [ActionTypes.START.id]: 'START',
    [ActionTypes.EXPLORE_WORLDS.id]: 'WORLDS',
    [ActionTypes.CAST_SPELLS.id]: 'SPELLS',
    [ActionTypes.LOOT.id]: 'LOOT',
    [ActionTypes.FIGHT_BOSSES.id]: 'BOSS',
    [ActionTypes.PHYSICS.id]: 'PHYSICS'
};

const UI_SOUNDS = {
    START: [
        '/src/assets/audio/UIaudio/start1.mp3',
        '/src/assets/audio/UIaudio/start2.mp3',
        '/src/assets/audio/UIaudio/start3.mp3'
    ],
    WORLDS: [
        '/src/assets/audio/UIaudio/worlds1.mp3',
        '/src/assets/audio/UIaudio/worlds2.mp3',
        '/src/assets/audio/UIaudio/worlds3.mp3'
    ],
    SPELLS: [
        '/src/assets/audio/UIaudio/spells1.mp3',
        '/src/assets/audio/UIaudio/spells2.mp3',
        '/src/assets/audio/UIaudio/spells3.mp3'
    ],
    LOOT: [
        '/src/assets/audio/UIaudio/loot1.mp3',
        '/src/assets/audio/UIaudio/loot2.mp3',
        '/src/assets/audio/UIaudio/loot3.mp3'
    ],
    BOSS: [
        '/src/assets/audio/UIaudio/boss1.mp3',
        '/src/assets/audio/UIaudio/boss2.mp3',
        '/src/assets/audio/UIaudio/boss3.mp3'
    ],
    PHYSICS: [
        '/src/assets/audio/UIaudio/force1.mp3',
        '/src/assets/audio/UIaudio/force2.mp3',
        '/src/assets/audio/UIaudio/force3.mp3'
    ]
};

class UIAudioManager {
    constructor() {
        this.sounds = {};
        this.initialized = false;
        this.currentSound = null;
    }

    init() {
        if (this.initialized) return;

        try {
            // Initialize all sounds with error handling
            Object.entries(UI_SOUNDS).forEach(([action, paths]) => {
                this.sounds[action] = paths.map(path => new Howl({
                    src: [path],
                    preload: true,
                    volume: 0.5,
                    onloaderror: (id, error) => {
                        console.error(`Error loading sound ${path}:`, error);
                    }
                }));
            });

            this.initialized = true;
            console.debug('UIAudioManager initialized with sounds:', Object.keys(this.sounds));
        } catch (error) {
            console.error('Error initializing UIAudioManager:', error);
        }
    }

    playActionSound(actionType) {
        if (!this.initialized) {
            console.debug('UIAudioManager not initialized');
            this.init(); // Auto-initialize if needed
            return;
        }

        console.debug('Attempting to play sound for action:', actionType);
        
        // Map the action type to sound category
        const soundCategory = ACTION_TO_SOUND[actionType];
        
        if (!soundCategory || !this.sounds[soundCategory]) {
            console.warn('No sounds found for action:', actionType, soundCategory);
            return;
        }

        const soundArray = this.sounds[soundCategory];
        if (!soundArray.length) {
            console.warn('Sound array empty for category:', soundCategory);
            return;
        }

        try {
            // Stop current sound if playing
            if (this.currentSound && this.currentSound.playing()) {
                this.currentSound.stop();
            }

            // Get random sound and ensure it's loaded
            const randomIndex = Math.floor(Math.random() * soundArray.length);
            const sound = soundArray[randomIndex];

            console.debug(`Playing ${soundCategory} sound variation ${randomIndex + 1}`);
            sound.play();
            this.currentSound = sound;

        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    dispose() {
        try {
            if (this.currentSound) {
                this.currentSound.stop();
            }
            Object.values(this.sounds).flat().forEach(sound => {
                if (sound) sound.unload();
            });
            this.sounds = {};
            this.initialized = false;
            this.currentSound = null;
        } catch (error) {
            console.error('Error disposing UIAudioManager:', error);
        }
    }
}

export const uiAudioManager = new UIAudioManager();