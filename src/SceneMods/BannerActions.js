import { BANNER_CONFIGS, ActionTypes } from './types';
import gsap from 'gsap';

// Import banner images
import startBanner from '/src/assets/images/banners/Logobaner.jpg';
import exploreBanner from '/src/assets/images/banners/exploreWorlds_compressed.png';
import spellsBanner from '/src/assets/images/banners/castSpells_compressed.png';
import lootBanner from '/src/assets/images/banners/loot_resized.jpg';
import bossBanner from '/src/assets/images/banners/fightBosses_compressed.png';
import physicsBanner from '/src/assets/images/banners/bendPhysics_compressed.png';

// Create a mapping for easy access - use the exact IDs from ActionTypes
export const BANNER_IMAGES = {
    'START': startBanner,
    'EXPLORE_WORLDS': exploreBanner,
    'CAST_SPELLS': spellsBanner,
    'LOOT': lootBanner,
    'FIGHT_BOSSES': bossBanner,
    'PHYSICS': physicsBanner,
    'DefaultAction': startBanner
};

// Base Banner Action class
export class BannerAction {
    constructor(bannerPlane) {
        this.bannerPlane = bannerPlane;
    }

    // Default transition effect
    transition() {
        // Example transition effect
        if (this.bannerPlane && this.bannerPlane.material) {
            // Fade out
            gsap.to(this.bannerPlane.material.opacity, {
                duration: 0.5,
                value: 0,
                onComplete: () => {
                    // Change texture
                    this.bannerPlane.material.map = this.execute();
                    // Fade in
                    gsap.to(this.bannerPlane.material.opacity, {
                        duration: 0.5,
                        value: 1
                    });
                }
            });
        }
    }

    execute() {
        return BANNER_CONFIGS[ActionTypes.START.id];
    }
}

export class StartBannerAction extends BannerAction {
    execute() {
        return BANNER_IMAGES[ActionTypes.START.id];
    }
}

export class WorldsBannerAction extends BannerAction {
    execute() {
        return BANNER_IMAGES[ActionTypes.EXPLORE_WORLDS.id];
    }
}

export class SpellsBannerAction extends BannerAction {
    execute() {
        return BANNER_IMAGES[ActionTypes.CAST_SPELLS.id];
    }
}

export class LootBannerAction extends BannerAction {
    execute() {
        return BANNER_IMAGES[ActionTypes.LOOT.id];
    }
}

export class BossBannerAction extends BannerAction {
    execute() {
        return BANNER_IMAGES[ActionTypes.FIGHT_BOSSES.id];
    }
}

export class PhysicsBannerAction extends BannerAction {
    execute() {
        return BANNER_IMAGES[ActionTypes.PHYSICS.id];
    }
}

export const BANNER_ACTION_MAP = {
  [ActionTypes.START]: StartBannerAction,
  [ActionTypes.EXPLORE_WORLDS]: WorldsBannerAction,
  [ActionTypes.CAST_SPELLS]: SpellsBannerAction,
  [ActionTypes.LOOT]: LootBannerAction,
  [ActionTypes.FIGHT_BOSSES]: BossBannerAction,
  [ActionTypes.PHYSICS]: PhysicsBannerAction,  // Add the new physics banner
  'WorldsAction': WorldsBannerAction  // Default fallback
}; 