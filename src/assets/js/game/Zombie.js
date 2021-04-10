import * as PIXI from "pixi.js";
import * as ResourceManager from "./ResourceManager";
import {Entity} from "./Entity";
import * as Util from "./Util";

const torsoColours = ["blue", "green", "orange", "purple", "grey", "red"];
const hairColours = ["brunette", "blonde", "ginger"];

export default class Zombie extends Entity {
    constructor(x, y, rotation) {
        super(20);

        // legs
        let legsSprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("normal_zombie_legs"));
        legsSprite.anchor.set(0.5, 0.55);
        legsSprite.angle = 90;
        legsSprite.play();
        this.addChild(legsSprite);

        // arms
        let armsSprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("normal_zombie_arms"));
        armsSprite.anchor.set(0.5, 0.92);
        armsSprite.angle = 90;
        armsSprite.play();
        this.addChild(armsSprite);

        // torso
        const randTorsoColour = torsoColours[Util.RandomInt(0, torsoColours.length - 1)];
        let torsoSprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("normal_zombie_torso_" + randTorsoColour));
        torsoSprite.anchor.set(0.5);
        torsoSprite.angle = 90;
        torsoSprite.play();
        this.addChild(torsoSprite);

        // head
        const randHairColour = hairColours[Util.RandomInt(0, hairColours.length - 1)];
        let headSprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("normal_zombie_head_" + randHairColour));
        headSprite.anchor.set(0.53, 0.5);
        headSprite.angle = 90;
        headSprite.play();
        this.addChild(headSprite);

        // container
        this.position.set(x, y);
        this.scale.set(1.25);
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
        // make leg animation faster than other sprites
        this.children[0].animationSpeed = speed * 0.6;
        for (let i = 1; i < this.children.length; i++) {
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