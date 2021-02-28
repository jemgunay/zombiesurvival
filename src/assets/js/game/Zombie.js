import * as PIXI from "pixi.js";
import * as ResourceManager from "./ResourceManager";
import {Entity} from "./Entity";

export default class Zombie extends Entity {
    constructor(pos) {
        super(20);

        // legs
        let legsSprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("zombie_legs"));
        legsSprite.anchor.set(0.5);
        legsSprite.angle = 180;
        legsSprite.animationSpeed = 0.2;
        legsSprite.play();
        this.addChild(legsSprite);

        // torso
        let torsoSprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("zombie_torso"));
        torsoSprite.anchor.set(0.5);
        if (Math.round(Math.random())) {
            legsSprite.scale.x *= -1;
        }
        torsoSprite.angle = 180;
        torsoSprite.animationSpeed = 0.2;
        torsoSprite.play();
        this.addChild(torsoSprite);

        // container
        this.position.set(pos.x, pos.y)
        this.scale.set(1.2, 1.2);
        this.speed = 0.4;
    }

    step(delta, targetPos) {
        // rotate to point in target's direction
        this.rotation = this.angleBetween(targetPos) - Math.PI * 0.5;

        // walk forwards
        this.position.x += Math.sin(this.rotation) * this.speed * delta * -1;
        this.position.y += Math.cos(this.rotation) * this.speed * delta;
    }
}