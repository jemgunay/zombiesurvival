import * as ResourceManager from "./ResourceManager";

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
            count: 20,
            projectileSpeed: 16,
            projectileDamage: 40,
        };
        this.ammo[RifleAmmo] = {
            count: 60,
            projectileSpeed: 18,
            projectileDamage: 26,
        };
        this.ammo[ShotgunAmmo] = {
            count: 20,
            projectileSpeed: 16,
            projectileDamage: 22,
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
            name: "1911 Pistol",
            trigger: SemiAutoTrigger,
            shootDuration: 190,
            reloadDuration: 1700,
            reloadType: ClipReload,
            ammoCapacity: 10,
            projectilesPerShot: 1,
            spread: 1,
            ammoType: PistolAmmo,
            idleFrame: 0,
            shootFrame: 1,
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
            name: "G3 Rifle",
            trigger: AutoTrigger,
            shootDuration: 150,
            reloadDuration: 2000,
            reloadType: ClipReload,
            ammoCapacity: 30,
            projectilesPerShot: 1,
            spread: 3,
            ammoType: RifleAmmo,
            idleFrame: 0,
            shootFrame: 1,
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
            name: "SPAS-12 Shotgun",
            trigger: SemiAutoTrigger,
            shootDuration: 800,
            reloadDuration: 600,
            reloadType: ShellReload,
            ammoCapacity: 8,
            projectilesPerShot: 10,
            spread: 18,
            ammoType: ShotgunAmmo,
            idleFrame: 0,
            shootFrame: 1,
            attackSounds: [
                "spas_12_shotgun_shoot_1",
                "spas_12_shotgun_shoot_2",
            ],
            reloadSound: "spas_12_shotgun_insert_shell",
            emptySound: "rifle_empty",
        });
    }
}