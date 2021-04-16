import * as PIXI from "pixi.js";
import Player from "./Player.js";
import * as Util from "./Util.js";
import * as Input from "./Input";
import LevelManager from "./LevelManager";
import * as ResourceManager from "./ResourceManager";
import Zombie from "./Zombie";
import * as Decal from "./Decal";
import * as Projectile from "./Projectile";
import {Game} from "./Game";

export default class World extends PIXI.Container {
    constructor(app) {
        super();

        this.app = app;
        this.sortableChildren = true;
        this.zombies = [];
        this.projectileManager = new Projectile.Manager(this);

        // tiled grass
        let groundSprite = new PIXI.TilingSprite(
            ResourceManager.GetTexture("grass"),
            app.screen.width * 4,
            app.screen.height * 4,
        );
        groundSprite.anchor.set(0.25);
        groundSprite.position.set(-app.screen.width/2, -app.screen.height/2);
        this.addChild(groundSprite);
        // farm border bottom
        let worldMapSpriteBottom = ResourceManager.GetSprite("farm_border_bottom");
        worldMapSpriteBottom.anchor.set(0.25);
        worldMapSpriteBottom.position.set(-app.screen.width/2, -app.screen.height/2);
        this.addChild(worldMapSpriteBottom);
        // blood decals
        // TODO: use ParticleContainers for decals (one container per texture required)
        this.decalContainer = new PIXI.Container();
        this.addChild(this.decalContainer);

        // create player
        this.player = new Player(app.screen.width / 2, app.screen.height / 2);
        this.addChild(this.player);

        // zombie layer
        this.zombieContainer = new PIXI.Container();
        this.addChild(this.zombieContainer);

        // farm border
        let worldMapSpriteTop = ResourceManager.GetSprite("farm_border_top");
        worldMapSpriteTop.anchor.set(0.25);
        worldMapSpriteTop.position.set(-app.screen.width/2, -app.screen.height/2);
        this.addChild(worldMapSpriteTop);

        // create levels
        this.levelManager = new LevelManager();
        this.levelManager.next();

        // start main game loop
        app.ticker.add(delta => {
            this.step(delta);
        });
    }

    step(delta) {
        // determine if zombie should spawn
        if (this.levelManager.shouldSpawn()) {
            this.spawnZombie();
        }

        // start next round
        if (this.levelManager.currentLevel.zombieCount === 0 && this.zombies.length === 0) {
            this.levelManager.next();
        }

        // sort zombies by distance
        this.zombies.sort((a, b) => a.distToPlayer - b.distToPlayer);

        // update all zombies
        for (let i = this.zombies.length - 1; i >= 0; i--) {
            this.zombies[i].step(delta);

            // determine if zombie is touching the zombie next closest to the player
            this.zombies[i].setNormalSpeed();
            if (i > 0) {
                if (this.zombies[i].hitTestCircle(this.zombies[i - 1])) {
                    this.zombies[i].setSlowSpeed();
                }
            }

            // check player collision with zombies
            if (this.player.alive && this.player.hitTestCircle(this.zombies[i])) {
                this.endGame();
            }
        }

        // update player
        this.player.step(delta);

        // make camera follow player
        let playerPos = this.player.getGlobalPosition();
        let cameraVel = {
            x: Math.abs(playerPos.x - this.app.screen.width / 2) * 0.05,
            y: Math.abs(playerPos.y - this.app.screen.height / 2) * 0.05,
        };
        if (cameraVel.x < 0.05) {
            cameraVel.x = 0;
        }
        if (cameraVel.y < 0.05) {
            cameraVel.y = 0;
        }
        if (playerPos.x < this.app.screen.width / 2) {
            this.x += cameraVel.x;
        } else if (playerPos.x > this.app.screen.width / 2) {
            this.x -= cameraVel.x;
        }
        if (playerPos.y < this.app.screen.height / 2) {
            this.y += cameraVel.y;
        } else if (playerPos.y > this.app.screen.height / 2) {
            this.y -= cameraVel.y;
        }

        // player attack
        if (Input.isMouseDown() && this.player.alive) {
            let projectiles = this.player.attack();
            for (let projectile of projectiles) {
                this.projectileManager.push(projectile);
            }
        }

        // check collisions between projectiles and zombies
        for (let i = this.projectileManager.projectiles.length - 1; i >= 0; i--) {
            let projectile = this.projectileManager.projectiles[i];
            projectile.step(delta);

            for (let j = this.zombies.length - 1; j >= 0; j--) {
                if (this.zombies[j].hitTestCircle(projectile)) {
                    if (this.zombies[j].applyDamage(projectile.damage)) {
                        // zombie died - play flesh exploding sound
                        ResourceManager.PlaySound("flesh_explode_" + Util.RandomInt(1, 4));

                        // directional blood splat decal
                        let newSplat = new Decal.NewDirectionalBlood(this.zombies[j].x, this.zombies[j].y, this.zombies[j].rotation);
                        this.decalContainer.addChild(newSplat);

                        // remove zombie
                        this.zombieContainer.removeChild(this.zombies[j]);
                        this.zombies.splice(j, 1);

                        // update kill counter
                        Game.ui.incrementKillCounter();
                    } else {
                        // zombie took damage, but didn't die - play bullet impact sound
                        ResourceManager.PlaySound("flesh_impact_" + Util.RandomInt(1, 8));

                        // downward blood splat decal
                        let newSplat = new Decal.NewDownwardBlood(this.zombies[j].x, this.zombies[j].y);
                        this.decalContainer.addChild(newSplat);
                    }

                    // TODO: apply impulse to zombie on impact
                    // remove projectile
                    this.projectileManager.drop(projectile);
                    break;
                }
            }
        }
    }

    spawnZombie() {
        // create zombie
        let randRadius = Util.DegToRad(Util.RandomInt(0, 360));
        let spawnPos = {
            x: this.player.position.x + (Math.cos(randRadius) * 450),
            y: this.player.position.y + (Math.sin(randRadius) * 450),
        };
        const spawnAngle = this.player.angleBetween(spawnPos) + Math.PI;
        let newZombie = new Zombie(spawnPos.x, spawnPos.y, spawnAngle, this.levelManager.currentLevel.zombieSpeed);
        if (this.player.alive) {
            newZombie.setTargetFunc(() => (this.player.position));
        } else {
            const newTarget = this.randomPositionOffScreen();
            newZombie.setTargetFunc(() => (newTarget));
        }
        this.zombies.push(newZombie);
        this.zombieContainer.addChild(newZombie);
    }

    endGame() {
        this.player.die();

        // set all zombies to an idle routine to leave the level bounds
        for (let zombie of this.zombies) {
            const newTarget = this.randomPositionOffScreen();
            zombie.setTargetFunc(() => {
                return newTarget;
            });
        }
    }

    randomPositionOffScreen() {
        let randRadius = Util.DegToRad(Util.RandomInt(0, 360));
        return {
            x: this.player.position.x + Math.cos(randRadius) * 1000,
            y: this.player.position.y + Math.sin(randRadius) * 1000,
        };
    }
}