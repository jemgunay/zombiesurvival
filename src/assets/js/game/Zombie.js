import * as PIXI from "pixi.js";
import * as ResourceManager from "./ResourceManager";
import {Entity} from "./Entity";
import * as Util from "./Util";

export default class Zombie extends Entity {
    constructor(x, y, rotation) {
        super(20);

        // legs
        let legsSprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("zombie_legs"));
        legsSprite.anchor.set(0.5);
        legsSprite.angle = 90;
        legsSprite.play();
        this.addChild(legsSprite);

        // torso
        let torsoSprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("zombie_torso"));
        torsoSprite.anchor.set(0.5);
        torsoSprite.angle = 90;
        torsoSprite.play();
        this.addChild(torsoSprite);

        // container
        this.position.set(x, y);
        this.scale.set(1.2, 1.2);
        // randomly flip
        if (Util.RandomBool()) {
            this.scale.y *= -1;
        }
        this.rotation = rotation;
        this.speed = 0;
        this.rotSpeed = 0.05;
        this.acceleration = 0.02;
        this.setTargetSpeed(0.6);
        this.health = 100;
    }

    setTargetSpeed(speed) {
        this.targetSpeed = speed;
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].animationSpeed = speed * 0.4;
        }
    }

    setTargetFunc(targetFunc) {
        this.targetFunc = targetFunc;
    }

    step(delta) {
        let targetPos = this.targetFunc();
        this.distToPlayer = this.distanceTo(targetPos);

        // rotate to point in target's direction
        let targetRot = this.angleBetween(targetPos) - this.rotation;
        if (targetRot < -Math.PI) {
            targetRot += Math.PI * 2;
        } else if (targetRot > Math.PI) {
            targetRot -= Math.PI * 2;
        }
        this.rotation += targetRot * delta * this.rotSpeed;

        // accelerate/decelerate zombie
        if (this.speed < this.targetSpeed) {
            this.speed += this.acceleration;
        } else if (this.speed > this.targetSpeed) {
            this.speed -= this.acceleration;
        }

        // walk forwards
        this.position.x += Math.sin(this.rotation + (Math.PI / 2)) * this.speed * delta;
        this.position.y += Math.cos(this.rotation - (Math.PI / 2)) * this.speed * delta;
    }

    // subtracts hitPoints from zombie health. Returns true if zombie is dead, otherwise false.
    applyDamage(hitPoints) {
        this.health -= hitPoints;
        return this.health <= 0;
    }
}