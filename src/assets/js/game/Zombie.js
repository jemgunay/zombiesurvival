import * as PIXI from "pixi.js";
import * as ResourceManager from "./ResourceManager";
//import Victor from "victor"

export default class Zombie {
    constructor(stage, pos) {
        // legs
        let legsSprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("zombie_legs"));
        legsSprite.anchor.set(0.5);
        legsSprite.angle = 180;
        legsSprite.animationSpeed = 0.2;
        legsSprite.play();

        // torso
        let torsoSprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("zombie_torso"));
        torsoSprite.anchor.set(0.5);
        torsoSprite.angle = 180;
        torsoSprite.animationSpeed = 0.2;
        torsoSprite.play();

        // create a zombie
        this.container = new PIXI.Container();
        this.container.position.set(pos.x, pos.y);
        this.container.angle = 270;
        this.container.scale.set(1.2, 1.2);
        this.speed = 0.4;

        this.container.addChild(legsSprite);
        this.container.addChild(torsoSprite);
        stage.addChild(this.container);
    }

    step(delta, targetPos) {
        // rotate to point in target's direction
        this.container.rotation = Math.atan2(targetPos.y - this.container.position.y, targetPos.x - this.container.position.x) - Math.PI/2;

        // walk forwards
        this.container.x += Math.sin(this.container.rotation) * this.speed * delta * -1;
        this.container.y += Math.cos(this.container.rotation) * this.speed * delta;
    }
}