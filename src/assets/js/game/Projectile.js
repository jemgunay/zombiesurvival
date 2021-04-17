import * as PIXI from "pixi.js";

export class Manager {
    constructor(container) {
        this.container = container;
        this.projectiles = [];
        this.currentID = 0;
    }

    push(projectile) {
        // give projectile unique ID to allow deletion
        projectile.id = this.currentID;
        this.currentID++;
        this.projectiles.push(projectile);
        this.container.addChild(projectile);
        // expire bullet after 5 seconds if no collision
        projectile.timeout = setTimeout(() => {
            this.drop(projectile);
        }, 5000);
    }

    drop(projectile) {
        clearTimeout(projectile.timeout);
        this.container.removeChild(projectile);
        this.projectiles = this.projectiles.filter(function (el) {
            return el.id !== projectile.id;
        });
    }
}

export class Projectile extends PIXI.Graphics {
    constructor(x, y, rotation, damage, speed) {
        super();

        this.damage = damage;
        this.radius = 2;
        this.beginFill(0x191919);
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