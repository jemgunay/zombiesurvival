import * as PIXI from "pixi.js";
import Player from "./Player.js"
import * as Util from "./Util.js"
import * as Input from "./Input";
import LevelManager from "./LevelManager";
import Zombie from "./Zombie";
import * as Decal from "./Decal";

export default class World {
    constructor(app) {
        this.app = app;
        this.zombies = [];
        this.projectiles = [];
        this.bloodDecals = [];
        this.decalContainer = new PIXI.Container();
        this.app.stage.addChild(this.decalContainer);

        // create player
        this.player = new Player(app.screen.width / 2, app.screen.height / 2);
        app.stage.addChild(this.player);

        // create spawn points
        this.spawnPoints = [
            {x: 50, y: 50},
            {x: 50, y: app.screen.height - 50},
            {x: app.screen.width - 50, y: 50},
            {x: app.screen.width - 50, y: app.screen.height - 50},
        ];

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
            this.zombies[i].setTargetSpeed(0.6);
            if (i > 0) {
                if (this.zombies[i].hitTestCircle(this.zombies[i - 1])) {
                    this.zombies[i].setTargetSpeed(0.2);
                }
            }

            // check player collision with zombies
            if (this.player.alive && this.player.hitTestCircle(this.zombies[i])) {
                this.endGame();
            }
        }

        // update player
        this.player.step(delta);

        // player attack
        if (Input.isMouseDown() && this.player.alive) {
            let projectiles = this.player.attack();
            for (let projectile of projectiles) {
                this.app.stage.addChild(projectile);
                this.projectiles.push(projectile);
            }
        }

        // check collisions between projectiles and zombies
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].step(delta);

            for (let j = this.zombies.length - 1; j >= 0; j--) {
                if (this.zombies[j].hitTestCircle(this.projectiles[i])) {
                    if (this.zombies[j].applyDamage(this.projectiles[i].damage)) {
                        // blood splat decal
                        let newSplat = new Decal.BloodSplat(this.zombies[j].x, this.zombies[j].y, this.zombies[j].rotation);
                        this.bloodDecals.push(newSplat);
                        this.decalContainer.addChild(newSplat);

                        // remove zombie
                        this.app.stage.removeChild(this.zombies[j]);
                        this.zombies.splice(j, 1);
                    }

                    // remove projectile
                    // TODO: apply impulse to zombie on impact
                    this.app.stage.removeChild(this.projectiles[i]);
                    this.projectiles.splice(i, 1);
                    break;
                }
            }
        }
    }

    spawnZombie() {
        // create zombie
        let randomSpawn = this.spawnPoints[Util.RandomNumber(0, this.spawnPoints.length - 1)];
        let newZombie = new Zombie(randomSpawn.x, randomSpawn.y, this.player.angleBetween(randomSpawn) + Math.PI);
        newZombie.setTargetFunc(() => (this.player.position));
        this.zombies.push(newZombie);
        this.app.stage.addChild(newZombie);
    }

    endGame() {
        this.player.die();

        // set all zombies to an idle routine to leave the level bounds
        for (let zombie of this.zombies) {
            let randRadius = Util.RandomNumber(0, 360) * Math.PI / 180;
            let targetX = Math.cos(randRadius) * this.app.screen.width * 1.2;
            let targetY = Math.sin(randRadius) * this.app.screen.width * 1.2;
            zombie.setTargetFunc(() => {
                return {x: targetX, y: targetY};
            });
        }
    }
}