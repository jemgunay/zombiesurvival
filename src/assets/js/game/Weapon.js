export const SemiAutoTrigger = "semi";
export const AutoTrigger = "auto";

export const IdleState = "idle";
export const ShootingState = "shooting";
export const EmptyBarrelState = "empty_barrel";
export const ReloadingState = "reloading";

export let PistolAmmo = "pistol_ammo";
export const RifleAmmo = "rifle_ammo";
export const ShotgunAmmo = "shotgun_ammo";

export class Armoury {
    constructor() {
        this.ammo = {};
        this.ammo[PistolAmmo] = {
            count: 20,
            projectileSpeed: 16,
            projectileDamage: 40,
        }
        this.ammo[RifleAmmo] = {
            count: 60,
            projectileSpeed: 18,
            projectileDamage: 26,
        }
        this.ammo[ShotgunAmmo] = {
            count: 20,
            projectileSpeed: 16,
            projectileDamage: 22,
        }
        this.weapons = [];
        this.equipped = null;
    }

    addWeapon(weapon) {
        this.weapons.push(weapon);
        // if no weapons are equipped, equip the first added weapon
        if (!this.equipped) {
            this.equip(0);
        }
    }

    equip(slotIndex) {
        if (slotIndex > this.weapons.length - 1) {
            return;
        }
        if (this.equipped !== null && this.equipped.state !== IdleState) {
            return;
        }
        this.equipped = this.weapons[slotIndex];
        console.log(`loaded: ${this.equipped.ammoLoaded}, armoury: ${this.ammo[this.equipped.ammoType].count} (${this.equipped.ammoType})`);
    }
}

export class Weapon {
    constructor(properties) {
        this.name = "";
        this.trigger = "";
        this.shootDuration = 0;
        this.reloadDuration = 0;
        this.ammoCapacity = 0;
        this.ammoLoaded = 0;
        this.projectilesPerShot = 0;
        this.spread = 0;
        this.ammoType = null;
        this.idleFrame = 0;
        this.shootFrame = 0;
        this.state = IdleState;

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
            name: "pistol",
            trigger: SemiAutoTrigger,
            shootDuration: 250,
            reloadDuration: 2000,
            ammoCapacity: 10,
            projectilesPerShot: 1,
            spread: 1,
            ammoType: PistolAmmo,
            idleFrame: 0,
            shootFrame: 1,
        });
    }
}

export class AssaultRifle extends Weapon {
    constructor() {
        super({
            name: "assault_rifle",
            trigger: AutoTrigger,
            shootDuration: 150,
            reloadDuration: 2000,
            ammoCapacity: 30,
            projectilesPerShot: 1,
            spread: 3,
            ammoType: RifleAmmo,
            idleFrame: 0,
            shootFrame: 1,
        });
    }
}

export class Shotgun extends Weapon {
    constructor() {
        super({
            name: "shotgun",
            trigger: SemiAutoTrigger,
            shootDuration: 800,
            reloadDuration: 2000,
            ammoCapacity: 8,
            projectilesPerShot: 10,
            spread: 18,
            ammoType: ShotgunAmmo,
            idleFrame: 0,
            shootFrame: 1,
        });
    }
}