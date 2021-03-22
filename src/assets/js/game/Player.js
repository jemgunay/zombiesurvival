import * as PIXI from "pixi.js";
import * as Input from "./Input";
import {Entity} from "./Entity";
import * as Weapon from "./Weapon";
import Projectile from "./Projectile";
import * as ResourceManager from "./ResourceManager";
import * as Util from "./Util";
import {Game} from "./Game";

export default class Player extends Entity {
    constructor(x, y) {
        super(18);

        // create the player
        let sprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("player"));
        sprite.anchor.set(0.5);
        sprite.scale.set(0.8, 0.8);
        sprite.animationSpeed = 0.5;
        this.sprite = sprite;

        this.position.set(x, y);
        this.rotation = Math.PI * 1.5;
        this.speed = 1.2;
        this.alive = true;
        this.armoury = new Weapon.Armoury();
        this.armoury.addWeapon(new Weapon.Pistol());
        this.armoury.addWeapon(new Weapon.AssaultRifle());
        this.armoury.addWeapon(new Weapon.Shotgun());

        this.addChild(sprite);
    }

    step(delta) {
        Game.ui.setAmmoText(this.armoury.equipped.ammoLoaded, this.armoury.ammo[this.armoury.equipped.ammoType].count);

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
        this.rotation = this.angleBetween(mousePos);

        if (Input.isKeyPressed(Input.Key1)) {
            this.armoury.equip(0);
        } else if (Input.isKeyPressed(Input.Key2)) {
            this.armoury.equip(1);
        } else if (Input.isKeyPressed(Input.Key3)) {
            this.armoury.equip(2);
        }

        // reload weapon
        if (Input.isKeyPressed(Input.KeyR)) {
            this.reload();
        }
        // enable shooting if weapon is in the empty barrel state, i.e. pistols
        if (!Input.isMouseDown() && this.armoury.equipped.state === Weapon.EmptyBarrelState) {
            this.armoury.equipped.state = Weapon.IdleState;
        }
    }

    attack() {
        if (this.armoury.equipped.state !== Weapon.IdleState || this.armoury.equipped.ammoLoaded === 0) {
            return [];
        }
        this.armoury.equipped.state = Weapon.ShootingState;
        this.sprite.gotoAndStop(this.armoury.equipped.shootFrame);
        this.armoury.equipped.ammoLoaded--;

        // reset to idle frame
        setTimeout(() => {
            this.sprite.gotoAndStop(this.armoury.equipped.idleFrame);
        }, 200);

        // end of attack - reset state
        setTimeout(() => {
            if (this.armoury.equipped.trigger === Weapon.SemiAutoTrigger) {
                this.armoury.equipped.state = Weapon.EmptyBarrelState;
                return;
            }
            this.armoury.equipped.state = Weapon.IdleState;
        }, this.armoury.equipped.shootDuration);

        // create projectile
        let projectiles = [];
        for (let i = 0; i < this.armoury.equipped.projectilesPerShot; i++) {
            let rotationOffset = Util.RandomNumber(0, this.armoury.equipped.spread);
            if (Util.RandomBool()) {
                rotationOffset *= -1;
            }
            let newProjectile = new Projectile(
                this.position.x,
                this.position.y,
                this.rotation + Util.DegToRad(rotationOffset),
                this.armoury.ammo[this.armoury.equipped.ammoType].projectileDamage,
                this.armoury.ammo[this.armoury.equipped.ammoType].projectileSpeed,
            );
            projectiles.push(newProjectile);
        }
        return projectiles;
    }

    reload() {
        // only reload if not firing
        if (this.armoury.equipped.state !== Weapon.IdleState) {
            return;
        }
        // don't reload if clip is full
        if (this.armoury.equipped.ammoLoaded === this.armoury.equipped.ammoCapacity) {
            return;
        }
        // ensure we have enough ammo in the armoury
        if (this.armoury.ammo[this.armoury.equipped.ammoType].count === 0) {
            return;
        }

        this.armoury.equipped.state = Weapon.ReloadingState;

        // determine how much ammo is required from the armoury
        let requiredAmmo = this.armoury.equipped.ammoCapacity - this.armoury.equipped.ammoLoaded;
        let diff = 0;
        if (this.armoury.ammo[this.armoury.equipped.ammoType].count >= requiredAmmo) {
            diff = requiredAmmo;
        } else {
            diff = this.armoury.ammo[this.armoury.equipped.ammoType].count;
        }

        setTimeout(() => {
            // move ammo from armoury to weapon
            this.armoury.ammo[this.armoury.equipped.ammoType].count -= diff;
            this.armoury.equipped.ammoLoaded += diff;

            this.armoury.equipped.state = Weapon.IdleState;
        }, this.armoury.equipped.reloadDuration);
    }

    die() {
        if (!this.alive) {
            return;
        }
        this.alive = false;
        this.sprite.gotoAndStop(2);
    }
}