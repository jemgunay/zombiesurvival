import * as PIXI from "pixi.js";
import * as Input from "./Input";
import * as ResourceManager from "./ResourceManager";

export default class Player {
    constructor(stage, pos) {
        // create the player
        this.sprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("player"));
        this.sprite.position.set(pos.x, pos.y);
        this.sprite.anchor.set(0.5);
        this.sprite.angle = 270;
        this.sprite.scale.set(0.8, 0.8);
        this.sprite.animationSpeed = 0.5;
        this.speed = 1.2;
        this.alive = true;

        stage.addChild(this.sprite);
    }

    pointTo(target) {
        this.sprite.rotation = Math.atan2(target.y - this.sprite.position.y, target.x - this.sprite.position.x)
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

        this.sprite.x += xv * delta * this.speed;
        this.sprite.y += yv * delta * this.speed;

        let mousePos = Input.getMousePosition()
        this.pointTo(mousePos);
    }

    shoot() {
        this.sprite.gotoAndStop(1)
        setTimeout(() => {
            this.sprite.gotoAndStop(0)
        }, 100)
    }

    die() {
        this.alive = false;
        this.sprite.gotoAndStop(2);
    }
}