import * as ResourceManager from "./ResourceManager";
import * as Util from "./Util";

export function NewDirectionalBlood(x, y, rotation) {
    let sprite = ResourceManager.GetSprite("directional_blood_splat");
    sprite.anchor.set(0.5, 0.6);
    sprite.position.set(x, y);
    sprite.rotation = rotation - Math.PI / 2;
    sprite.scale.set(0.35 + (Math.random() / 10));
    sprite.alpha = 0.6;
    // randomly flip
    if (Util.RandomBool()) {
        sprite.scale.x *= -1;
    }
    return sprite;
}

export function NewDownwardBlood(x, y) {
    let sprite = ResourceManager.GetSprite("downward_blood_splat");
    sprite.anchor.set(0.5);
    sprite.position.set(x, y);
    sprite.rotation = Util.DegToRad(Util.RandomInt(0, 360));
    sprite.scale.set(0.1 + (Math.random() / 10));
    sprite.alpha = 0.6;
    return sprite;
}