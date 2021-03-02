import * as PIXI from "pixi.js";

export default class Projectile extends PIXI.Graphics {
    constructor(x, y, rotation, damage, speed) {
        super();

        this.damage = damage;
        this.radius = 2;
        this.beginFill(0x9966FF);
        this.drawCircle(0, 0, this.radius);
        this.endFill();
        this.x = x;
        this.y = y;

        this.vx = Math.cos(rotation) * speed;
        this.vy = Math.sin(rotation) * speed;
    }

    step(delta) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;
    }
}