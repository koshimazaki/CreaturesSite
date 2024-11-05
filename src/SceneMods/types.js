// Import model paths first
import PyramidModel from '/src/assets/models/pyramid2.glb?url'
import FireModel from '/src/assets/models/coconut.glb?url'
import BossModel from '/src/assets/models/boss.glb?url'
import CharacterModel from '/src/assets/models/OGanim-transformed.glb?url'
import PalmModel from '/src/assets/models/palm.glb?url'
import LootModel from '/src/assets/models/coconut.glb?url'

import pyramidModel from '/src/assets/models/pyramid2.glb?url'
import palmModel from '/src/assets/models/palm.glb?url'
import fireModel from '/src/assets/models/coconut.glb?url'
import bossModel from '/src/assets/models/boss.glb?url'
import lootModel from '/src/assets/models/coconut.glb?url'

import characterModel from '/src/assets/models/OGanim-transformed.glb?url'
import cyberpunkSpeederModel from '/src/assets/models/cyberpunk_speeder-transformed.glb?url'
import vcs3Model from '/src/assets/models/vcs3-transformed.glb?url'
import moogModel from '/src/assets/models/moog-transformed.glb?url'
import tripoModel from '/src/assets/models/tripo3EM3-transformed.glb?url'
import DragonModel from '/src/assets/models/Dragon-transformed.glb?url'
import GamepadModel from '/src/assets/models/gamepad-transformed.glb?url'
import PlantModel from '/src/assets/models/plant1-transformed.glb?url'
import PastelCreatureModel from '/src/assets/models/PastelAnim-transformed.glb?url'



// Model Types
export const ModelTypes = {
  PYRAMID: 'pyramid',
  PALM: 'palm',
  FIRE: 'fire',
  BOSS: 'boss',
  LOOT: 'loot',
  MAIN_CHARACTER: 'mainCharacter'
};

export const SCENE_MODELS = {
  speeder: cyberpunkSpeederModel,
  vcs3: vcs3Model,
  moog: moogModel,
  tripo: tripoModel,
  dragon: DragonModel,
  gamepad: GamepadModel,
  plant: PlantModel,
  character: characterModel,
};

export const TRANSITION_MODELS = {
  pyramid: pyramidModel,
  palm: palmModel,
  fire: fireModel,
  boss: bossModel,
  loot: lootModel,
  character: characterModel,
  pastelCreature: PastelCreatureModel
};

// Model Paths
export const MODEL_PATHS = {
  pyramid: pyramidModel,
  palm: palmModel,
  fire: fireModel,
  boss: bossModel,
  loot: lootModel,
  character: characterModel,
  speeder: cyberpunkSpeederModel,
  vcs3: vcs3Model,
  moog: moogModel,
  tripo: tripoModel,
  dragon: DragonModel,
  gamepad: GamepadModel,
  plant: PlantModel
};


// Model Sources (define before using in configs)
export const MODEL_SOURCES = {
  [ModelTypes.PYRAMID]: PyramidModel,
  [ModelTypes.PALM]: PalmModel,
  [ModelTypes.FIRE]: FireModel,
  [ModelTypes.BOSS]: BossModel,
  [ModelTypes.MAIN_CHARACTER]: CharacterModel,
  [ModelTypes.LOOT]: LootModel
};

// Action Types with function names matching BannerActions
export const ActionTypes = {
  START: {
    id: 'START',
    function: 'StartAction',
    type: 'model'
  },
  EXPLORE_WORLDS: {
    id: 'EXPLORE_WORLDS',
    function: 'WorldsAction',
    type: 'model'
  },
  CAST_SPELLS: {
    id: 'CAST_SPELLS',
    function: 'SpellsAction',
    type: 'model'
  },
  LOOT: {
    id: 'LOOT',
    function: 'LootAction',
    type: 'model'
  },
  FIGHT_BOSSES: {
    id: 'FIGHT_BOSSES',
    function: 'BossAction',
    type: 'model'
  },
  PHYSICS: {
    id: 'PHYSICS',
    function: 'PhysicsAction',
    type: 'model'
  }
};

// Simplified Action to Model Mapping
export const ACTION_TO_MODEL = {
  'StartAction': null,
  'WorldsAction': ModelTypes.PYRAMID,
  'SpellsAction': ModelTypes.FIRE,
  'BossAction': ModelTypes.BOSS,
  'PhysicsAction': ModelTypes.MAIN_CHARACTER
};

// Button configurations for MorphingButton
export const BUTTON_CONFIGS = {
  'StartAction': {
    text: 'Start',
    nextAction: 'WorldsAction'
  },
  'WorldsAction': {
    text: 'Explore Worlds',
    nextAction: 'SpellsAction'
  },
  'SpellsAction': {
    text: 'Cast Spells',
    nextAction: 'LootAction'
  },
  'LootAction': {
    text: 'Loot',
    nextAction: 'BossAction'
  },
  'BossAction': {
    text: 'Fight Bosses',
    nextAction: 'PhysicsAction'
  },
  'PhysicsAction': {
    text: 'Bend Physics',
    nextAction: 'StartAction'
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
  [ModelTypes.LOOT]: {
    source: MODEL_SOURCES[ModelTypes.LOOT],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
    animations: {
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

// Banner configurations
export const BANNER_CONFIGS = {
  [ActionTypes.START.id]: '/src/assets/images/Logobaner.png',
  [ActionTypes.EXPLORE_WORLDS.id]: '/src/assets/images/exploreWorlds.png',
  [ActionTypes.CAST_SPELLS.id]: '/src/assets/images/castSpells.png',
  [ActionTypes.LOOT.id]: '/src/assets/images/loot.png',
  [ActionTypes.FIGHT_BOSSES.id]: '/src/assets/images/fightBosses.png',
  [ActionTypes.PHYSICS.id]: '/src/assets/images/bendPhysics.png'
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

  [ModelTypes.LOOT]: {
    action: ActionTypes.LOOT.id,
    config: MODEL_CONFIGS[ModelTypes.LOOT],
    banner: BANNER_CONFIGS[ActionTypes.LOOT.id],
    type: 'model'
  },

  [ModelTypes.BOSS]: {
    action: ActionTypes.FIGHT_BOSSES.id,
    config: MODEL_CONFIGS[ModelTypes.BOSS],
    banner: BANNER_CONFIGS[ActionTypes.FIGHT_BOSSES.id],
    type: 'model'
  },
  [ModelTypes.MAIN_CHARACTER]: {
    action: ActionTypes.PHYSICS.id,
    type: 'animation',
    triggers: ['physics', 'animation'],
    banner: BANNER_CONFIGS[ActionTypes.PHYSICS.id]
  }
};

// Action to Function mapping
export const ACTION_FUNCTIONS = {
  'StartAction': 'StartAction',
  'WorldsAction': 'WorldsAction',
  'SpellsAction': 'SpellsAction',
  'LootAction': 'LootAction',
  'BossAction': 'BossAction',
  'PhysicsAction': 'PhysicsAction'
};

export const stateOrder = [0, 1, 2, 3, 4, 5];

export const STATE_TO_ACTION = {
    0: ActionTypes.START,
    1: ActionTypes.EXPLORE_WORLDS,
    2: ActionTypes.CAST_SPELLS,
    3: ActionTypes.LOOT,
    4: ActionTypes.FIGHT_BOSSES,
    5: ActionTypes.PHYSICS
}; 