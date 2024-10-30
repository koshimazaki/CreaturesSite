// Import model paths first
import PyramidModel from '/src/assets/models/pyramid2.glb?url'
import FireModel from '/src/assets/models/coconut.glb?url'
import BossModel from '/src/assets/models/boss.glb?url'
import CharacterModel from '/src/assets/models/OGanim-transformed.glb?url'
import PalmModel from '/src/assets/models/palm.glb?url'

// Model Types
export const ModelTypes = {
  PYRAMID: 'pyramid',
  PALM: 'palm',
  FIRE: 'fire',
  BOSS: 'boss',
  MAIN_CHARACTER: 'mainCharacter'
};

// Model Sources (define before using in configs)
export const MODEL_SOURCES = {
  [ModelTypes.PYRAMID]: PyramidModel,
  [ModelTypes.PALM]: PalmModel,
  [ModelTypes.FIRE]: FireModel,
  [ModelTypes.BOSS]: BossModel,
  [ModelTypes.MAIN_CHARACTER]: CharacterModel
};

// Action Types
export const ActionTypes = {
  START: {
    id: 'Start',
    type: 'reset'
  },
  EXPLORE_WORLDS: {
    id: 'ExploreWorlds',
    type: 'model',
    model: 'pyramid'
  },
  CAST_SPELLS: {
    id: 'CastSpells',
    type: 'model',
    model: 'fire'
  },
  FIGHT_BOSSES: {
    id: 'FightBosses',
    type: 'model',
    model: 'boss'
  },
  BEND_PHYSICS: {
    id: 'BendPhysics',
    type: 'animation',
    target: 'mainCharacter',
    triggers: ['physics', 'animation']
  }
};

// Model Configurations (now MODEL_SOURCES is defined)
export const MODEL_CONFIGS = {
  [ModelTypes.PYRAMID]: {
    source: MODEL_SOURCES[ModelTypes.PYRAMID],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
    animations: {
      hover: true,
      rotate: true,
      breathe: true
    }
  },
  [ModelTypes.PALM]: {
    source: MODEL_SOURCES[ModelTypes.PALM],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 0.8,
    animations: {
      hover: true,
      flicker: true
    }
  },
  [ModelTypes.FIRE]: {
    source: MODEL_SOURCES[ModelTypes.FIRE],
    position: [0, 1, 0],
    rotation: [0, 0, 0],
    scale: 0.8,
    animations: {
      hover: true,
      flicker: true
    }
  },
  [ModelTypes.BOSS]: {
    source: MODEL_SOURCES[ModelTypes.BOSS],
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: 1.2,
    animations: {
      idle: true,
      hover: true
    }
  },
  [ModelTypes.MAIN_CHARACTER]: {
    source: MODEL_SOURCES[ModelTypes.MAIN_CHARACTER],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
    animations: {
      physics: true,
      character: true
    }
  }
};

// Action to Model Mapping
export const ACTION_TO_MODEL = {
  [ActionTypes.START]: null,
  [ActionTypes.EXPLORE_WORLDS]: ModelTypes.PYRAMID,
  [ActionTypes.CAST_SPELLS]: ModelTypes.FIRE,
  [ActionTypes.FIGHT_BOSSES]: ModelTypes.BOSS,
  [ActionTypes.BEND_PHYSICS]: ModelTypes.MAIN_CHARACTER
};

// Banner configurations
export const BANNER_CONFIGS = {
  [ActionTypes.START]: '/src/assets/images/Logobaner.png',
  [ActionTypes.EXPLORE_WORLDS]: '/src/assets/images/exploreWorlds.png',
  [ActionTypes.CAST_SPELLS]: '/src/assets/images/castSpells.png',
  [ActionTypes.FIGHT_BOSSES]: '/src/assets/images/fightBosses.png',
  [ActionTypes.BEND_PHYSICS]: '/src/assets/images/bendPhysics.png'
};

// Action handlers
export const ACTION_HANDLERS = {
  model: (modelName, scene) => {
    return MODEL_CONFIGS[modelName];
  },
  animation: (config, scene) => {
    return {
      triggerPhysics: () => {},
      triggerAnimation: () => {}
    };
  },
  reset: () => null
};

// Model Action Map
export const MODEL_ACTION_MAP = {
  [ModelTypes.PYRAMID]: {
    action: ActionTypes.EXPLORE_WORLDS.id,
    config: MODEL_CONFIGS[ModelTypes.PYRAMID],
    banner: BANNER_CONFIGS[ActionTypes.EXPLORE_WORLDS.id],
    type: 'model'
  },
  [ModelTypes.PALM]: {
    action: ActionTypes.EXPLORE_WORLDS.id,
    config: MODEL_CONFIGS[ModelTypes.PALM],
    banner: BANNER_CONFIGS[ActionTypes.EXPLORE_WORLDS.id],
    type: 'model'
  },
  [ModelTypes.FIRE]: {
    action: ActionTypes.CAST_SPELLS.id,
    config: MODEL_CONFIGS[ModelTypes.FIRE],
    banner: BANNER_CONFIGS[ActionTypes.CAST_SPELLS.id],
    type: 'model'
  },
  [ModelTypes.BOSS]: {
    action: ActionTypes.FIGHT_BOSSES.id,
    config: MODEL_CONFIGS[ModelTypes.BOSS],
    banner: BANNER_CONFIGS[ActionTypes.FIGHT_BOSSES.id],
    type: 'model'
  },
  [ModelTypes.MAIN_CHARACTER]: {
    action: ActionTypes.BEND_PHYSICS.id,
    type: 'animation',
    triggers: ['physics', 'animation'],
    banner: BANNER_CONFIGS[ActionTypes.BEND_PHYSICS.id]
  }
}; 