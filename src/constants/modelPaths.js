// Import models using relative paths with ?url
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

export const SCENE_MODELS = {
    speeder: cyberpunkSpeederModel,
    vcs3: vcs3Model,
    moog: moogModel,
    tripo: tripoModel,
    dragon: DragonModel,
    gamepad: GamepadModel,
    plant: PlantModel
};

export const TRANSITION_MODELS = {
    pyramid: pyramidModel,
    palm: palmModel,
    fire: fireModel,
    boss: bossModel,
    loot: lootModel,
    character: characterModel
}; 