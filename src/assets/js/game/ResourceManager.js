import * as PIXI from "pixi.js";

let frameStore = {};

// loads all sprite sheets into memory, then process frames out of them for consumption during sprite creation.
export function Load(completedCallback) {
    PIXI.Loader.shared
        .add('player', 'game/player.json')
        .add('zombie_legs', 'game/zombie_legs.json')
        .add('zombie_torso', 'game/zombie_torso.json')
        .add('large_zombie_torso', 'game/large_zombie_torso.json')
        .add('directional_blood_splat', 'game/directional_blood_splat.png')
        .load(function () {
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
