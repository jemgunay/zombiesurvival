import * as PIXI from "pixi.js";
import * as Input from "./Input";
import * as ResourceManager from "./ResourceManager";

export default class Player {
    constructor(stage, vec) {
        // create the player
        this.sprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("player"));

        this.sprite.anchor.set(0.5);
        this.sprite.position.set(vec.x, vec.y);
        this.sprite.angle = 270;
        this.sprite.animationSpeed = 0.5;
        this.speed = 1.2;

        stage.addChild(this.sprite);
    }

    pointTo(targetX, targetY) {
        this.sprite.rotation = Math.atan2(targetY - this.sprite.position.y, targetX - this.sprite.position.x)
    }

    step(delta) {
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
        this.pointTo(mousePos.x, mousePos.y);
    }

    shoot() {
        this.sprite.gotoAndStop(1)
        setTimeout(() => {
            this.sprite.gotoAndStop(0)
        }, 100)
    }
}