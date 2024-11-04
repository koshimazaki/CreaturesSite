import { Howl } from 'howler';
import { ActionTypes } from '../SceneMods/types';

// Import all audio files at the top
import start1 from '@assets/audio/start1.mp3'
import start2 from '@assets/audio/start2.mp3'
import start3 from '@assets/audio/start3.mp3'
import worlds1 from '@assets/audio/worlds1.mp3'
import worlds2 from '@assets/audio/worlds2.mp3'
import worlds3 from '@assets/audio/worlds3.mp3'
import spells1 from '@assets/audio/spells1.mp3'
import spells2 from '@assets/audio/spells2.mp3'
import spells3 from '@assets/audio/spells3.mp3'
import loot1 from '@assets/audio/loot1.mp3'
import loot2 from '@assets/audio/loot2.mp3'
import loot3 from '@assets/audio/loot3.mp3'
import boss1 from '@assets/audio/boss1.mp3'
import boss2 from '@assets/audio/boss2.mp3'
import boss3 from '@assets/audio/boss3.mp3'
import force1 from '@assets/audio/force1.mp3'
import force2 from '@assets/audio/force2.mp3'
import force3 from '@assets/audio/force3.mp3'

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
        start1,
        start2,
        start3
    ],
    WORLDS: [
        worlds1,
        worlds2,
        worlds3
    ],
    SPELLS: [
        spells1,
        spells2,
        spells3
    ],
    LOOT: [
        loot1,
        loot2,
        loot3
    ],
    BOSS: [
        boss1,
        boss2,
        boss3
    ],
    PHYSICS: [
        force1,
        force2,
        force3
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