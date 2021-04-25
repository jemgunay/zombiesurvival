import * as PIXI from "pixi.js";
import "pixi-sound";

// loads all sprite sheets into memory, then process frames out of them for consumption during sprite creation.
export function Load(completedCallback) {
    PIXI.Loader.shared
        // sprite sheets
        .add("player", "game/images/sprite_sheets/player.json")
        .add("normal_zombie_head_brunette", "game/images/sprite_sheets/normal_zombie_head_brunette.json")
        .add("normal_zombie_head_blonde", "game/images/sprite_sheets/normal_zombie_head_blonde.json")
        .add("normal_zombie_head_ginger", "game/images/sprite_sheets/normal_zombie_head_ginger.json")
        .add("normal_zombie_torso_blue", "game/images/sprite_sheets/normal_zombie_torso_blue.json")
        .add("normal_zombie_torso_green", "game/images/sprite_sheets/normal_zombie_torso_green.json")
        .add("normal_zombie_torso_orange", "game/images/sprite_sheets/normal_zombie_torso_orange.json")
        .add("normal_zombie_torso_purple", "game/images/sprite_sheets/normal_zombie_torso_purple.json")
        .add("normal_zombie_torso_grey", "game/images/sprite_sheets/normal_zombie_torso_grey.json")
        .add("normal_zombie_torso_red", "game/images/sprite_sheets/normal_zombie_torso_red.json")
        .add("normal_zombie_arms", "game/images/sprite_sheets/normal_zombie_arms.json")
        .add("normal_zombie_legs", "game/images/sprite_sheets/normal_zombie_legs.json")
        // static images
        .add("grass", "game/images/grass.jpg")
        .add("directional_blood_splat", "game/images/directional_blood_splat.png")
        .add("downward_blood_splat", "game/images/downward_blood_splat.png")
        .add("farm_border_top", "game/images/farm_border_top.png")
        .add("farm_border_bottom", "game/images/farm_border_bottom.png")
        .add("normal_zombie_gib_1", "game/images/gibs/normal_zombie_gib_1.png")
        .add("normal_zombie_gib_2", "game/images/gibs/normal_zombie_gib_2.png")
        .add("normal_zombie_gib_3", "game/images/gibs/normal_zombie_gib_3.png")
        .add("normal_zombie_gib_4", "game/images/gibs/normal_zombie_gib_4.png")
        .add("normal_zombie_gib_5", "game/images/gibs/normal_zombie_gib_5.png")
        .add("normal_zombie_gib_6", "game/images/gibs/normal_zombie_gib_6.png")
        .add("normal_zombie_gib_7", "game/images/gibs/normal_zombie_gib_7.png")
        // sounds
        // weapons
        .add("1911_pistol_shoot_1", "game/sounds/1911_pistol/1911_pistol_shot_1.wav")
        .add("1911_pistol_shoot_2", "game/sounds/1911_pistol/1911_pistol_shot_2.wav")
        .add("1911_pistol_reload", "game/sounds/1911_pistol/pistol_reload.mp3")
        .add("pistol_empty", "game/sounds/1911_pistol/pistol_dryfire.wav")
        .add("g3_rifle_shoot_1", "game/sounds/g3_rifle/g3_rifle_shot_1.wav")
        .add("g3_rifle_shoot_2", "game/sounds/g3_rifle/g3_rifle_shot_2.wav")
        .add("g3_rifle_reload", "game/sounds/g3_rifle/rifle_reload.mp3")
        .add("rifle_empty", "game/sounds/g3_rifle/rifle_dryfire.wav")
        .add("spas_12_shotgun_shoot_1", "game/sounds/spas_12_shotgun/spas_12_shotgun_shot_1.wav")
        .add("spas_12_shotgun_shoot_2", "game/sounds/spas_12_shotgun/spas_12_shotgun_shot_2.wav")
        .add("spas_12_shotgun_insert_shell", "game/sounds/spas_12_shotgun/spas_12_shotgun_insert_shell.wav")
        .add("change_weapon", "game/sounds/change_weapon.wav")
        .add("ammo_pickup", "game/sounds/ammo_pickup.wav")
        // flesh impact
        .add("flesh_impact_1", "game/sounds/flesh_impact/blt_imp_flesh_lyr_plr_10.wav")
        .add("flesh_impact_2", "game/sounds/flesh_impact/blt_imp_flesh_plr_04.wav")
        .add("flesh_impact_3", "game/sounds/flesh_impact/blt_imp_flesh_plr_05.wav")
        .add("flesh_impact_4", "game/sounds/flesh_impact/blt_imp_flesh_plr_11.wav")
        .add("flesh_impact_5", "game/sounds/flesh_impact/bullet_flesh_head_npc_02.wav")
        .add("flesh_impact_6", "game/sounds/flesh_impact/bullet_flesh_head_npc_03.wav")
        .add("flesh_impact_7", "game/sounds/flesh_impact/bullet_flesh_head_npc_04.wav")
        .add("flesh_impact_8", "game/sounds/flesh_impact/bullet_flesh_head_npc_05.wav")
        .add("flesh_explode_1", "game/sounds/flesh_explode/gib_body_explode_01.wav")
        .add("flesh_explode_2", "game/sounds/flesh_explode/gib_body_explode_02.wav")
        .add("flesh_explode_3", "game/sounds/flesh_explode/gib_body_explode_03.wav")
        .add("flesh_explode_4", "game/sounds/flesh_explode/gib_body_explode_09.wav")
        // walk on grass
        .add("walk_grass_1", "game/sounds/walk_grass/step_sprint_grass_short_r_01.wav")
        .add("walk_grass_2", "game/sounds/walk_grass/step_sprint_grass_short_r_02.wav")
        .add("walk_grass_3", "game/sounds/walk_grass/step_sprint_grass_short_r_03.wav")
        .load(function () {
            // generate frames from sprite sheets
            LoadFramesFromTexture("player", 5);
            LoadFramesFromTexture("normal_zombie_head_brunette", 19);
            LoadFramesFromTexture("normal_zombie_head_blonde", 19);
            LoadFramesFromTexture("normal_zombie_head_ginger", 19);
            LoadFramesFromTexture("normal_zombie_torso_blue", 19);
            LoadFramesFromTexture("normal_zombie_torso_green", 19);
            LoadFramesFromTexture("normal_zombie_torso_orange", 19);
            LoadFramesFromTexture("normal_zombie_torso_purple", 19);
            LoadFramesFromTexture("normal_zombie_torso_grey", 19);
            LoadFramesFromTexture("normal_zombie_torso_red", 19);
            LoadFramesFromTexture("normal_zombie_arms", 19);
            LoadFramesFromTexture("normal_zombie_legs", 33);
            completedCallback();
        });
}

let frameStore = {};

// loads N frames from a given sprite sheet and stores them.
export function LoadFramesFromTexture(prefix, endFrame) {
    let frames = [];
    let num = "";
    for (let i = 0; i < endFrame; i++) {
        if (i > 99) {
            num = `0${i}`;
        } else if (i > 9) {
            num = `00${i}`;
        } else {
            num = `000${i}`;
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
        console.error("frames not generated for " + prefix);
        return;
    }
    return frameStore[prefix];
}

export function PlaySound(name) {
    PIXI.Loader.shared.resources[name].sound.play();
}