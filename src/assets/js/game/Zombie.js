import * as PIXI from "pixi.js";
import * as ResourceManager from "./ResourceManager";
//import Victor from "victor"

export default class Zombie {
    constructor(stage, pos) {
        // create a zombie
        this.sprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("zombie_legs"));

        this.sprite.anchor.set(0.5);
        this.sprite.position.set(pos.x, pos.y);
        this.sprite.angle = 270;
        this.sprite.animationSpeed = 0.2;
        this.sprite.play();
        this.speed = 0.4;

        stage.addChild(this.sprite);
    }

    step(delta, targetPos) {
        let targetAngle = this.sprite.rotation = Math.atan2( targetPos.y - this.sprite.position.y, targetPos.x - this.sprite.position.x);
        if (this.sprite.rotation < targetAngle) {
            this.sprite.rotation += Math.PI / 2;
        } else {
            this.sprite.rotation -= Math.PI / 2;
        }

        this.sprite.x += Math.sin(this.sprite.rotation) * this.speed * delta * -1;
        this.sprite.y += Math.cos(this.sprite.rotation) * this.speed * delta;
    }
}