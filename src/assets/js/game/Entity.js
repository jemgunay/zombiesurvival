import * as PIXI from "pixi.js";

export class Entity extends PIXI.Container {
    constructor(radius) {
        super();
        this.radius = radius;
    }

    angleBetween(pos) {
        return Math.atan2(pos.y - this.position.y, pos.x - this.position.x);
    }

    distanceTo(pos) {
        return Math.sqrt(Math.pow(this.position.x - pos.x, 2) + Math.pow(this.position.y - pos.y, 2));
    }

    hitTestRect(container) {
        // find the center points of each sprite
        container.centerX = container.x + container.width / 2;
        container.centerY = container.y + container.height / 2;
        this.centerX = this.x + this.width / 2;
        this.centerY = this.y + this.height / 2;

        // find the half-widths and half-heights of each sprite
        container.halfWidth = container.width / 2;
        container.halfHeight = container.height / 2;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;

        // calculate the distance vector between the sprites
        let vx = container.centerX - this.centerX;
        let vy = container.centerY - this.centerY;

        // figure out the combined half-widths and half-heights
        let combinedHalfWidths = container.halfWidth + this.halfWidth;
        let combinedHalfHeights = container.halfHeight + this.halfHeight;

        return Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights;
    }

    hitTestCircle(container) {
        let dist = this.distanceTo(container.position);
        let totalLength = container.radius + this.radius;
        return dist <= totalLength;
    }

    debugDraw(stage) {
        if (this.debugCircle === undefined) {
            this.debugCircle = new PIXI.Graphics();
            this.debugCircle.beginFill(0x9966FF);
            this.debugCircle.drawCircle(0, 0, this.radius);
            this.debugCircle.endFill();
            stage.addChild(this.debugCircle);
        }
        this.debugCircle.position.x = this.position.x;
        this.debugCircle.position.y = this.position.y;
    }
}