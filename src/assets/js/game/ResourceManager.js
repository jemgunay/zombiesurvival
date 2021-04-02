import * as PIXI from "pixi.js";
import 'pixi-sound';

let frameStore = {};

// loads all sprite sheets into memory, then process frames out of them for consumption during sprite creation.
export function Load(completedCallback) {
    PIXI.Loader.shared
        // sprite sheets
        .add('player', 'game/images/sprite_sheets/player.json')
        .add('zombie_legs', 'game/images/sprite_sheets/zombie_legs.json')
        .add('zombie_torso', 'game/images/sprite_sheets/zombie_torso.json')
        .add('large_zombie_torso', 'game/images/sprite_sheets/large_zombie_torso.json')
        // static images
        .add('grass', 'game/images/grass.jpg')
        .add('directional_blood_splat', 'game/images/directional_blood_splat.png')
        .add('downward_blood_splat', 'game/images/downward_blood_splat.png')
        // sounds
        .add('1911_pistol_shoot_1', 'game/sounds/1911_pistol/weap_mike1911_fire_plr_01.wav')
        .add('1911_pistol_shoot_2', 'game/sounds/1911_pistol/weap_mike1911_fire_plr_02.wav')
        .add('carbine_rifle_shoot_1', 'game/sounds/mk2_carbine/weap_sbeta_sup_npc_01.wav')
        .add('carbine_rifle_shoot_2', 'game/sounds/mk2_carbine/weap_sbeta_sup_npc_02.wav')
        .add('romeo_shotgun_shoot_1', 'game/sounds/romeo_shotgun/weap_romeo870_fire_npc_01.wav')
        .add('romeo_shotgun_shoot_2', 'game/sounds/romeo_shotgun/weap_romeo870_fire_npc_06.wav')
        .add('pistol_empty', 'game/sounds/weap_dryfire_pistol.wav')
        .add('rifle_empty', 'game/sounds/weap_dryfire_rifle.wav')
        .add('change_weapon', 'game/sounds/weap_raise_gen_02.wav')
        .load(function () {
            // generate frames from sprite sheets
            LoadFramesFromTexture('player', 3);
            LoadFramesFromTexture('zombie_legs', 17);
            LoadFramesFromTexture('zombie_torso', 17);
            LoadFramesFromTexture('large_zombie_torso', 19);
            completedCallback();
        });

    // PIXI.sound.add('shot', 'game/sounds/1911_pistol/weap_mike1911_fire_plr_01.wav');
    // PIXI.sound.play('shot');
}

// loads N frames from a given sprite sheet and stores them.
export function LoadFramesFromTexture(prefix, frameCount) {
    let frames = [];
    let num = ''
    for (let i = 0; i < frameCount; i++) {
        if (i > 99) {
            num = `0${i}`
        } else if (i > 9) {
            num = `00${i}`
        } else {
            num = `000${i}`
        }
        frames.push(PIXI.Texture.from(prefix + `_` + num));
    }
    frameStore[prefix] = frames;
}

// GetTexture returns a cached image texture.
export function GetTexture(prefix) {
    return PIXI.utils.TextureCache[prefix];
}

// GetSprite creates a spite from a cached image texture.
export function GetSprite(prefix) {
    return new PIXI.Sprite(PIXI.utils.TextureCache[prefix]);
}

// returns the pre-processed frames corresponding with the provided prefix from the store.
export function GetFrames(prefix) {
    if (!(prefix in frameStore)) {
        console.error("frames not generated for " + prefix)
        return
    }
    return frameStore[prefix];
}

export function PlaySound(name) {
    PIXI.Loader.shared.resources[name].sound.play();
}