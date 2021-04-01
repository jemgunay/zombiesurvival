import * as PIXI from "pixi.js";

let frameStore = {};

// loads all sprite sheets into memory, then process frames out of them for consumption during sprite creation.
export function Load(completedCallback) {
    PIXI.Loader.shared
        // sprite sheets
        .add('player', 'game/images/player.json')
        .add('zombie_legs', 'game/images/zombie_legs.json')
        .add('zombie_torso', 'game/images/zombie_torso.json')
        .add('large_zombie_torso', 'game/images/large_zombie_torso.json')
        // static images
        .add('grass', 'game/images/grass.jpg')
        .add('directional_blood_splat', 'game/images/directional_blood_splat.png')
        .add('downward_blood_splat', 'game/images/downward_blood_splat.png')
        // sounds
        //.add('bird', 'game/sounds/pistol.mp3')
        .load(function () {
            // generate frames from sprite sheets
            LoadFramesFromTexture('player', 3);
            LoadFramesFromTexture('zombie_legs', 17);
            LoadFramesFromTexture('zombie_torso', 17);
            LoadFramesFromTexture('large_zombie_torso', 19);
            completedCallback();
        });
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
