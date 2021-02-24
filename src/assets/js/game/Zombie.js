import * as PIXI from "pixi.js";

export default class Zombie {
    constructor(stage, pos) {
        // create zombie frames
        let frames = [];
        for (let i = 0; i < 16; i++) {
            frames.push(PIXI.Texture.from(`zombie_legs_000${i}`));
        }

        // create the player
        this.sprite = new PIXI.AnimatedSprite(frames);
        this.sprite.anchor.set(0.5);
        this.sprite.position.set(pos.x, pos.y);
        this.sprite.angle = 270;
        this.speed = 0.6;
        this.sprite.animationSpeed = 0.5;
        this.sprite.play();
        stage.addChild(this.sprite);
    }

    setTarget(pos) {
        this.target = pos
    }

    step(delta) {
        this.sprite.y += this.speed * delta
    }
}