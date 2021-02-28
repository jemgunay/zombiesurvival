import * as PIXI from "pixi.js";

export class Entity extends PIXI.Container {
    constructor() {
        super();
    }

    pointTo(pos) {
        this.rotation = Math.atan2(pos.y - this.position.y, pos.x - this.position.x) - Math.PI * 0.5;
    }
}