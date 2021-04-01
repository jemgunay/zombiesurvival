import * as PIXI from "pixi.js";
import Player from "./Player.js"
import * as Util from "./Util.js"
import * as Input from "./Input";
import LevelManager from "./LevelManager";
import * as ResourceManager from "./ResourceManager";
import Zombie from "./Zombie";
import * as Decal from "./Decal";

export default class World extends PIXI.Container {
    constructor(app) {
        super();

        this.app = app;
        this.sortableChildren = true;
        this.zombies = [];
        this.projectiles = [];
        let groundSprite = new PIXI.TilingSprite(
            ResourceManager.GetTexture('grass'),
            app.screen.width*2,
            app.screen.height*2,
        );
        groundSprite.anchor.set(0.25);
        //groundSprite.tileScale.set(0.25);
        this.addChild(groundSprite);
        // TODO: use ParticleContainers for decals
        this.decalContainer = new PIXI.Container();
        this.addChild(this.decalContainer);

        // create player
        this.player = new Player(app.screen.width / 2, app.screen.height / 2);
        this.addChild(this.player);

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

        // make camera follow player
        let playerPos = this.player.getGlobalPosition();
        let cameraVel = {
            x: Math.abs(playerPos.x - this.app.screen.width/2) * 0.1,
            y: Math.abs(playerPos.y - this.app.screen.height/2) * 0.1,
        };
        if (cameraVel.x < 0.05) {
            cameraVel.x = 0;
        }
        if (cameraVel.y < 0.05) {
            cameraVel.y = 0;
        }
        if (playerPos.x < this.app.screen.width/2) {
            this.x += cameraVel.x;
        } else if (playerPos.x > this.app.screen.width/2) {
            this.x -= cameraVel.x;
        }
        if (playerPos.y < this.app.screen.height/2) {
            this.y += cameraVel.y;
        } else if (playerPos.y > this.app.screen.height/2) {
            this.y -= cameraVel.y;
        }

        // player attack
        if (Input.isMouseDown() && this.player.alive) {
            let projectiles = this.player.attack();
            for (let projectile of projectiles) {
                this.addChild(projectile);
                this.projectiles.push(projectile);
            }
        }

        // check collisions between projectiles and zombies
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].step(delta);

            for (let j = this.zombies.length - 1; j >= 0; j--) {
                if (this.zombies[j].hitTestCircle(this.projectiles[i])) {
                    if (this.zombies[j].applyDamage(this.projectiles[i].damage)) {
                        // directional  blood splat decal
                        let newSplat = new Decal.NewDirectionalBlood(this.zombies[j].x, this.zombies[j].y, this.zombies[j].rotation);
                        this.decalContainer.addChild(newSplat);

                        // remove zombie
                        this.removeChild(this.zombies[j]);
                        this.zombies.splice(j, 1);
                    } else {
                        // downward blood splat decal
                        let newSplat = new Decal.NewDownwardBlood(this.zombies[j].x, this.zombies[j].y);
                        this.decalContainer.addChild(newSplat);
                    }

                    // remove projectile
                    // TODO: apply impulse to zombie on impact
                    this.removeChild(this.projectiles[i]);
                    this.projectiles.splice(i, 1);
                    break;
                }
            }
        }
    }

    spawnZombie() {
        // create zombie
        let randomSpawn = this.spawnPoints[Util.RandomInt(0, this.spawnPoints.length - 1)];
        let newZombie = new Zombie(randomSpawn.x, randomSpawn.y, this.player.angleBetween(randomSpawn) + Math.PI);
        newZombie.setTargetFunc(() => (this.player.position));
        this.zombies.push(newZombie);
        this.addChild(newZombie);
    }

    endGame() {
        this.player.die();

        // set all zombies to an idle routine to leave the level bounds
        for (let zombie of this.zombies) {
            let randRadius = Util.RandomInt(0, 360) * Math.PI / 180;
            let targetX = Math.cos(randRadius) * 1000 * 1.2;
            let targetY = Math.sin(randRadius) * 1000 * 1.2;
            zombie.setTargetFunc(() => {
                return {x: targetX, y: targetY};
            });
        }
    }
}