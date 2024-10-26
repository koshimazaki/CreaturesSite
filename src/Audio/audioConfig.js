// src/config/audioConfig.js

// Import audio files
import candiesExploration from '/src/assets/audio/Candies_Exploration.mp3?url';
import floralMechas from '/src/assets/audio/Floral_Mechas.mp3?url';
import dubtech from '/src/assets/audio/AI12v3.mp3?url';
import lofiFields from '/src/assets/audio/Lowfi_Fileds.mp3?url';
import suddenAmbush from '/src/assets/audio/AI5.1.mp3?url';
import swampyCreatures from '/src/assets/audio/AI6.mp3?url';
import morphings from '/src/assets/audio/Morphings.mp3?url';

export const playlist = [
  {
    id: 'candies-exploration',
    title: "Candies Exploration",
    src: candiesExploration,
    duration: '3:45', // Optional: Add duration if needed
    artist: 'Your Artist', // Optional: Add additional metadata
  },
  {
    id: 'floral-mechas',
    title: "Floral Mechas",
    src: floralMechas,
  },
  {
    id: 'dubtech',
    title: "Dubtech",
    src: dubtech,
  },
  {
    id: 'lofi-fields',
    title: "Lofi Fields",
    src: lofiFields,
  },
  {
    id: 'sudden-ambush',
    title: "Sudden Ambush",
    src: suddenAmbush,
  },
  {
    id: 'swampy-creatures',
    title: "Swampy Creatures",
    src: swampyCreatures,
  },
  {
    id: 'morphings',
    title: "Morphings",
    src: morphings,
  }
];

// Audio configuration constants
export const AUDIO_CONFIG = {
  DEFAULT_VOLUME: 75,
  FADE_DURATION: 0.5,
  ANALYSER_FFT_SIZE: 2048,
  CROSS_FADE_DURATION: 0.1,
};

// Audio event types
export const AUDIO_EVENTS = {
  TRACK_ENDED: 'track-ended',
  TRACK_CHANGED: 'track-changed',
  VOLUME_CHANGED: 'volume-changed',
  PLAYBACK_ERROR: 'playback-error',
};