import * as PIXI from "pixi.js";
import {Stage} from "./Game";
import * as Input from "./Input";

export default class Player {
    constructor(x, y) {
        // create the player
        this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources['player_handgun'].texture);
        this.sprite.anchor.set(0.5);
        this.sprite.position.set(x, y);
        this.sprite.angle = 270;
        this.speed = 1.2;
        Stage.addChild(this.sprite);
    }

    pointTo(targetX, targetY) {
        // point player to mouse
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
}