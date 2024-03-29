import * as PIXI from "pixi.js";
import * as Input from "./Input";
import {Entity} from "./Entity";
import * as Weapon from "./Weapon";
import * as Projectile from "./Projectile";
import * as ResourceManager from "./ResourceManager";
import * as Util from "./Util";
import {Game} from "./Game";

export default class Player extends Entity {
    constructor(x, y) {
        super(18);

        // create the player
        let sprite = new PIXI.AnimatedSprite(ResourceManager.GetFrames("player"));
        sprite.anchor.set(0.5);
        sprite.scale.set(0.8);
        sprite.animationSpeed = 0.5;
        this.sprite = sprite;

        this.position.set(x, y);
        this.rotation = Math.PI * 1.5;
        this.speed = 1.2;
        this.alive = true;
        this.playingWalkingSound = false;
        this.armoury = new Weapon.Armoury();
        this.armoury.addWeapon(new Weapon.Pistol());
        this.armoury.addWeapon(new Weapon.AssaultRifle());
        this.armoury.addWeapon(new Weapon.Shotgun());
        //this.armoury.addWeapon(new Weapon.TurboRifle());

        this.addChild(sprite);
    }

    step(delta) {
        // TODO: only update on change, not every frame
        Game.ui.setAmmoText(this.armoury.equipped.name, this.armoury.equipped.ammoLoaded, this.armoury.ammo[this.armoury.equipped.ammoType].count);

        if (this.alive === false) {
            return;
        }

        // move player but prevent leaving world bounds
        let xv = 0;
        let yv = 0;
        if ((Input.isKeyPressed(Input.KeyA) || Input.isKeyPressed(Input.KeyLeft)) && this.position.x > -95) {
            xv = -1;
        } else if ((Input.isKeyPressed(Input.KeyD) || Input.isKeyPressed(Input.KeyRight)) && this.position.x < 818) {
            xv = 1;
        }
        if ((Input.isKeyPressed(Input.KeyW) || Input.isKeyPressed(Input.KeyUp)) && this.position.y > -145) {
            yv = -1;
        } else if ((Input.isKeyPressed(Input.KeyS) || Input.isKeyPressed(Input.KeyDown)) && this.position.y < 640) {
            yv = 1;
        }

        // handle walking sounds
        if (xv !== 0 || yv !== 0) {
            if (!this.playingWalkingSound) {
                this.playingWalkingSound = true;
                ResourceManager.PlaySound("walk_grass_" + Util.RandomInt(1, 3));

                setTimeout(() => {
                    this.playingWalkingSound = false;
                }, 450);
            }
        }

        // rotate player to point at mouse
        this.position.set(this.position.x + xv * delta * this.speed, this.position.y + yv * delta * this.speed);
        let mousePos = Input.getMousePosition();
        this.rotation = this.angleBetweenGlobal(mousePos);

        // handle weapon switching
        if (Input.isKeyPressed(Input.Key1)) {
            this.armoury.equip(0);
        } else if (Input.isKeyPressed(Input.Key2)) {
            this.armoury.equip(1);
        } else if (Input.isKeyPressed(Input.Key3)) {
            this.armoury.equip(2);
        } else if (Input.isKeyPressed(Input.Key4)) {
            this.armoury.equip(3);
        } else if (Input.isKeyPressed(Input.Key5)) {
            this.armoury.equip(4);
        } else if (Input.isKeyPressed(Input.KeyQ)) {
            this.armoury.equipPrevious();
        } else if (Input.isKeyPressed(Input.KeyE)) {
            this.armoury.equipNext();
        }

        // set idle frame to cover when weapon switch is complete
        if (this.armoury.equipped.state === Weapon.IdleState) {
            this.sprite.gotoAndStop(this.armoury.equipped.idleFrame);
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
        if (this.armoury.equipped.state !== Weapon.IdleState || this.armoury.switching === true) {
            return [];
        }
        // no ammo left in clip
        if (this.armoury.equipped.ammoLoaded === 0) {
            // play empty clip sound
            this.armoury.equipped.state = Weapon.EmptyClipState;
            if (this.armoury.equipped.emptySound !== "") {
                ResourceManager.PlaySound(this.armoury.equipped.emptySound);
            }
            setTimeout(() => {
                if (this.alive && this.armoury.equipped.state === Weapon.EmptyClipState) {
                    this.armoury.equipped.state = Weapon.IdleState;
                }
            }, this.armoury.equipped.shootDuration);
            return [];
        }
        this.armoury.equipped.state = Weapon.ShootingState;
        this.sprite.gotoAndStop(this.armoury.equipped.shootFrame);
        this.armoury.equipped.ammoLoaded--;

        // play random attack sound
        if (this.armoury.equipped.attackSounds.length > 0) {
            let randSoundIndex = Util.RandomInt(0, this.armoury.equipped.attackSounds.length - 1);
            let randSound = this.armoury.equipped.attackSounds[randSoundIndex];
            ResourceManager.PlaySound(randSound);
        }

        // reset to idle frame
        setTimeout(() => {
            if (this.alive) {
                this.sprite.gotoAndStop(this.armoury.equipped.idleFrame);
            }
        }, 100);

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
            // apply random spread to simulate recoil
            let rotationOffset = Util.RandomInt(0, this.armoury.equipped.spread);
            if (Util.RandomBool()) {
                rotationOffset *= -1;
            }
            // offset projectile from barrel of gun
            const rot = this.rotation + Util.DegToRad(this.armoury.equipped.offsetAngle);
            const projectilePos = {
                x: this.position.x + (Math.cos(rot) * this.armoury.equipped.offsetDist),
                y: this.position.y + (Math.sin(rot) * this.armoury.equipped.offsetDist),
            };
            // create projectile
            let newProjectile = new Projectile.Projectile(
                projectilePos.x,
                projectilePos.y,
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

        // default 1 ammo for ShellReload, override for ClipReload
        let diff = 1;
        if (this.armoury.equipped.reloadType === Weapon.ClipReload) {
            // determine how much ammo is required from the armoury
            const requiredAmmo = this.armoury.equipped.ammoCapacity - this.armoury.equipped.ammoLoaded;
            if (this.armoury.ammo[this.armoury.equipped.ammoType].count >= requiredAmmo) {
                diff = requiredAmmo;
            } else {
                diff = this.armoury.ammo[this.armoury.equipped.ammoType].count;
            }
        }

        // start reload sound
        ResourceManager.PlaySound(this.armoury.equipped.reloadSound);

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
        // play flesh exploding sound
        ResourceManager.PlaySound("flesh_explode_" + Util.RandomInt(1, 4));
        this.alive = false;
        this.sprite.gotoAndStop(0);
    }
}