import * as PIXI from "pixi.js";
import 'pixi-sound';

let frameStore = {};

// loads all sprite sheets into memory, then process frames out of them for consumption during sprite creation.
export function Load(completedCallback) {
    PIXI.Loader.shared
        // sprite sheets
        .add('player', 'game/images/sprite_sheets/player.json')
        .add('normal_zombie_head_brunette', 'game/images/sprite_sheets/normal_zombie_head_brunette.json')
        .add('normal_zombie_head_blonde', 'game/images/sprite_sheets/normal_zombie_head_blonde.json')
        .add('normal_zombie_head_ginger', 'game/images/sprite_sheets/normal_zombie_head_ginger.json')
        .add('normal_zombie_torso_blue', 'game/images/sprite_sheets/normal_zombie_torso_blue.json')
        .add('normal_zombie_torso_green', 'game/images/sprite_sheets/normal_zombie_torso_green.json')
        .add('normal_zombie_torso_orange', 'game/images/sprite_sheets/normal_zombie_torso_orange.json')
        .add('normal_zombie_torso_purple', 'game/images/sprite_sheets/normal_zombie_torso_purple.json')
        .add('normal_zombie_torso_grey', 'game/images/sprite_sheets/normal_zombie_torso_grey.json')
        .add('normal_zombie_torso_red', 'game/images/sprite_sheets/normal_zombie_torso_red.json')
        .add('normal_zombie_arms', 'game/images/sprite_sheets/normal_zombie_arms.json')
        .add('normal_zombie_legs', 'game/images/sprite_sheets/normal_zombie_legs.json')
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
        .add('flesh_impact_1', 'game/sounds/flesh_impact/blt_imp_flesh_lyr_plr_10.wav')
        .add('flesh_impact_2', 'game/sounds/flesh_impact/blt_imp_flesh_plr_04.wav')
        .add('flesh_impact_3', 'game/sounds/flesh_impact/blt_imp_flesh_plr_05.wav')
        .add('flesh_impact_4', 'game/sounds/flesh_impact/blt_imp_flesh_plr_11.wav')
        .add('flesh_impact_5', 'game/sounds/flesh_impact/bullet_flesh_head_npc_02.wav')
        .add('flesh_impact_6', 'game/sounds/flesh_impact/bullet_flesh_head_npc_03.wav')
        .add('flesh_impact_7', 'game/sounds/flesh_impact/bullet_flesh_head_npc_04.wav')
        .add('flesh_impact_8', 'game/sounds/flesh_impact/bullet_flesh_head_npc_05.wav')
        .add('flesh_explode_1', 'game/sounds/flesh_explode/gib_body_explode_01.wav')
        .add('flesh_explode_2', 'game/sounds/flesh_explode/gib_body_explode_02.wav')
        .add('flesh_explode_3', 'game/sounds/flesh_explode/gib_body_explode_03.wav')
        .add('flesh_explode_4', 'game/sounds/flesh_explode/gib_body_explode_09.wav')
        .add('walk_grass_1', 'game/sounds/walk_grass/step_sprint_grass_short_r_01.wav')
        .add('walk_grass_2', 'game/sounds/walk_grass/step_sprint_grass_short_r_02.wav')
        .add('walk_grass_3', 'game/sounds/walk_grass/step_sprint_grass_short_r_03.wav')
        .load(function () {
            // generate frames from sprite sheets
            LoadFramesFromTexture('player', 3);
            LoadFramesFromTexture('normal_zombie_head_brunette', 19);
            LoadFramesFromTexture('normal_zombie_head_blonde', 19);
            LoadFramesFromTexture('normal_zombie_head_ginger', 19);
            LoadFramesFromTexture('normal_zombie_torso_blue', 19);
            LoadFramesFromTexture('normal_zombie_torso_green', 19);
            LoadFramesFromTexture('normal_zombie_torso_orange', 19);
            LoadFramesFromTexture('normal_zombie_torso_purple', 19);
            LoadFramesFromTexture('normal_zombie_torso_grey', 19);
            LoadFramesFromTexture('normal_zombie_torso_red', 19);
            LoadFramesFromTexture('normal_zombie_arms', 19);
            LoadFramesFromTexture('normal_zombie_legs', 33);
            completedCallback();
        });
}

// loads N frames from a given sprite sheet and stores them.
export function LoadFramesFromTexture(prefix, endFrame) {
    let frames = [];
    let num = ''
    for (let i = 0; i < endFrame; i++) {
        if (i > 99) {
            num = `0${i}`
        } else if (i > 9) {
            num = `00${i}`
        } else {
            num = `000${i}`
        }
        frames.push(PIXI.Texture.from(prefix + num));
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