import * as PIXI from "pixi.js";
import * as ResourceManager from "./ResourceManager";

export class BloodSplat extends PIXI.Container {
    constructor(x, y, rotation) {
        super();

        this.sprite = ResourceManager.GetSprite('directional_blood_splat')
        this.sprite.anchor.set(0.5);
        this.sprite.position.set(x, y);
        this.sprite.rotation = rotation - Math.PI*0.75;
        this.sprite.scale.set(0.3, 0.3);
        this.addChild(this.sprite);
    }
}