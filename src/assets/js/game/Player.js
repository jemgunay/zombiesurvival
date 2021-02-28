import * as PIXI from "pixi.js";
import * as Input from "./Input";
import {Entity} from "./Entity";
import * as ResourceManager from "./ResourceManager";

export default class Player extends Entity {
    constructor(pos) {
        super();

        // create the player
        let sprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("player"));
        sprite.anchor.set(0.5);
        sprite.scale.set(0.8, 0.8);
        sprite.animationSpeed = 0.5;
        this.sprite = sprite;

        this.position.set(pos.x, pos.y)
        this.rotation = Math.PI * 1.5;
        this.speed = 1.2;
        this.alive = true;

        this.addChild(sprite);
    }

    step(delta) {
        if (this.alive === false) {
            return;
        }

        let xv = 0;
        let yv = 0;
        if (Input.isKeyPressed(Input.KeyA) || Input.isKeyPressed(Input.KeyLeft)) {
            xv = -1;
        } else if (Input.isKeyPressed(Input.KeyD) || Input.isKeyPressed(Input.KeyRight)) {
            xv = 1;
        }
        if (Input.isKeyPressed(Input.KeyW) || Input.isKeyPressed(Input.KeyUp)) {
            yv = -1;
        } else if (Input.isKeyPressed(Input.KeyS) || Input.isKeyPressed(Input.KeyDown)) {
            yv = 1;
        }

        this.position.set(this.position.x + xv * delta * this.speed, this.position.y + yv * delta * this.speed);

        let mousePos = Input.getMousePosition();
        this.pointTo(mousePos);
    }

    shoot() {
        this.sprite.gotoAndStop(1);
        setTimeout(() => {
            this.sprite.gotoAndStop(0)
        }, 100);
    }

    die() {
        if (!this.alive) {
            return;
        }
        this.alive = false;
        this.sprite.gotoAndStop(2);
    }
}