import Player from "./Player.js"
import * as Util from "./Util.js"
import * as Input from "./Input";
import LevelManager from "./LevelManager";
import Zombie from "./Zombie";

export default class World {
    constructor(app) {
        this.app = app;
        this.zombies = [];
        this.projectiles = [];

        // create player
        this.player = new Player(app.screen.width / 2, app.screen.height / 2);
        app.stage.addChild(this.player);

        // create spawn points
        const halfWidth = app.screen.width/2;
        const halfHeight = app.screen.height/2;
        this.spawnPoints = [
            {x: halfWidth - 200, y: halfHeight + 200},
            {x: halfWidth + 200, y: halfHeight + 200},
            {x: halfWidth + 200, y: halfHeight - 200},
            {x: halfWidth - 200, y: halfHeight - 200},
        ];

        // create levels
        this.levelManager = new LevelManager();
        this.levelManager.start(0);

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

        if (this.levelManager.currentLevel.zombieCount === 0 && this.zombies.length === 0) {
            this.levelManager.start(this.levelManager.currentLevelIndex + 1);
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
            if (projectiles !== null) {
                for (let projectile of projectiles) {
                    this.app.stage.addChild(projectile);
                    this.projectiles.push(projectile);
                }
            }
        }

        // check collisions between projectiles and zombies
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].step(delta);

            for (let j = this.zombies.length - 1; j >= 0; j--) {
                if (this.zombies[j].hitTestCircle(this.projectiles[i])) {
                    if (this.zombies[j].applyDamage(this.projectiles[i].damage)) {
                        // remove zombie
                        // TODO: blood splat
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
        let randomSpawn = this.spawnPoints[Util.RandomNumber(0, this.spawnPoints.length - 1)]
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