import * as ResourceManager from "./ResourceManager";
import * as PIXI from "pixi.js";
import * as Util from "./Util";

export const SemiAutoTrigger = "semi";
export const AutoTrigger = "auto";

export const ClipReload = "clip";
export const ShellReload = "shell";

export const IdleState = "idle";
export const ShootingState = "shooting";
export const EmptyBarrelState = "empty_barrel";
export const EmptyClipState = "empty_clip";
export const ReloadingState = "reloading";

export const PistolAmmo = "pistol_ammo";
export const RifleAmmo = "rifle_ammo";
export const ShotgunAmmo = "shotgun_ammo";

export class Armoury {
    constructor() {
        this.ammo = {};
        this.ammo[PistolAmmo] = {
            name: PistolAmmo,
            count: 40,
            ammoDropSize: 10,
            projectileSpeed: 16,
            projectileDamage: 40,
            spriteName: "pistol_ammo"
        };
        this.ammo[RifleAmmo] = {
            name: RifleAmmo,
            count: 60,
            ammoDropSize: 30,
            projectileSpeed: 18,
            projectileDamage: 34,
            spriteName: "rifle_ammo"
        };
        this.ammo[ShotgunAmmo] = {
            name: ShotgunAmmo,
            count: 4,
            ammoDropSize: 8,
            projectileSpeed: 16,
            projectileDamage: 22,
            spriteName: "shotgun_ammo"
        };
        this.weapons = [];
        this.equipped = null;
        this.equippedIndex = null;
        this.switching = false;
    }

    addWeapon(weapon) {
        this.weapons.push(weapon);
        // if no weapons are equipped, equip the first added weapon
        if (!this.equipped) {
            this.equip(0);
        }
    }

    equip(slotIndex) {
        if (slotIndex > this.weapons.length - 1 || this.switching) {
            return;
        }
        if (this.equipped !== null && this.equipped.state !== IdleState) {
            return;
        }
        if (this.equippedIndex === slotIndex) {
            return;
        }
        this.equippedIndex = slotIndex;
        this.equipped = this.weapons[slotIndex];
        ResourceManager.PlaySound("change_weapon");

        this.switching = true;
        setTimeout(() => {
            this.switching = false;
        }, 500);
    }

    equipPrevious() {
        if (this.equippedIndex === 0) {
            this.equip(this.weapons.length - 1);
            return;
        }
        this.equip(this.equippedIndex - 1);
    }

    equipNext() {
        if (this.equippedIndex === this.weapons.length - 1) {
            this.equip(0);
            return;
        }
        this.equip(this.equippedIndex + 1);
    }
}

export class AmmoDrop extends PIXI.Sprite {
    constructor(x, y, ammoType) {
        super(ResourceManager.GetTexture(ammoType.spriteName));

        this.anchor.set(0.5, 0.5);
        this.scale.set(0.7);
        this.radius = 10;
        this.position.set(x, y);
        this.rotation = Util.DegToRad(Util.RandomInt(0, 360));
        this.ammoType = ammoType;
    }
}

export class Weapon {
    constructor(properties) {
        this.name = "";
        this.trigger = "";
        this.shootDuration = 0;
        this.reloadDuration = 0;
        this.reloadType = "";
        this.ammoCapacity = 0;
        this.ammoLoaded = 0;
        this.projectilesPerShot = 0;
        this.spread = 0;
        this.offsetDist = 0;
        this.offsetAngle = 0;
        this.ammoType = null;
        this.idleFrame = 0;
        this.shootFrame = 0;
        this.state = IdleState;
        this.attackSounds = [];
        this.reloadSound = "";
        this.emptySound = "";

        // if starting loaded ammo not specified, provide a full clip by default
        if (!properties.ammoLoaded) {
            this.ammoLoaded = properties.ammoCapacity;
        }
        Object.assign(this, properties);
    }
}

export class Pistol extends Weapon {
    constructor() {
        super({
            name: "1911",
            trigger: SemiAutoTrigger,
            shootDuration: 190,
            reloadDuration: 1700,
            reloadType: ClipReload,
            ammoCapacity: 10,
            projectilesPerShot: 1,
            spread: 1,
            offsetDist: 25,
            offsetAngle: 7,
            ammoType: PistolAmmo,
            idleFrame: 1,
            shootFrame: 2,
            attackSounds: [
                "1911_pistol_shoot_1",
                "1911_pistol_shoot_2",
            ],
            reloadSound: "1911_pistol_reload",
            emptySound: "pistol_empty",
        });
    }
}

export class AssaultRifle extends Weapon {
    constructor() {
        super({
            name: "G3",
            trigger: AutoTrigger,
            shootDuration: 150,
            reloadDuration: 2000,
            reloadType: ClipReload,
            ammoCapacity: 30,
            projectilesPerShot: 1,
            spread: 3,
            offsetDist: 45,
            offsetAngle: 20,
            ammoType: RifleAmmo,
            idleFrame: 3,
            shootFrame: 4,
            attackSounds: [
                "g3_rifle_shoot_1",
                "g3_rifle_shoot_2",
            ],
            reloadSound: "g3_rifle_reload",
            emptySound: "rifle_empty",
        });
    }
}

export class Shotgun extends Weapon {
    constructor() {
        super({
            name: "SPAS-12",
            trigger: SemiAutoTrigger,
            shootDuration: 800,
            reloadDuration: 600,
            reloadType: ShellReload,
            ammoCapacity: 8,
            projectilesPerShot: 12,
            spread: 18,
            offsetDist: 45,
            offsetAngle: 0,
            ammoType: ShotgunAmmo,
            idleFrame: 1,
            shootFrame: 2,
            attackSounds: [
                "spas_12_shotgun_shoot_1",
                "spas_12_shotgun_shoot_2",
            ],
            reloadSound: "spas_12_shotgun_insert_shell",
            emptySound: "rifle_empty",
        });
    }
}

/*export class TurboRifle extends Weapon {
    constructor() {
        super({
            name: "Turbo Rifle",
            trigger: AutoTrigger,
            shootDuration: 50,
            reloadDuration: 500,
            reloadType: ClipReload,
            ammoCapacity: 10000,
            projectilesPerShot: 5,
            spread: 10,
            offsetDist: 45,
            offsetAngle: 20,
            ammoType: RifleAmmo,
            idleFrame: 3,
            shootFrame: 4,
            attackSounds: [
                "g3_rifle_shoot_1",
                "g3_rifle_shoot_2",
            ],
            reloadSound: "g3_rifle_reload",
            emptySound: "rifle_empty",
        });
    }
}*/
