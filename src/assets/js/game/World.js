import Player from "./Player.js"
import Zombie from "./Zombie.js"
import * as Input from "./Input";

export default class World {
    constructor(app) {
        this.app = app;
        this.projectiles = [];

        // create player;
        this.player = new Player(app.screen.width / 2, app.screen.height / 2);
        app.stage.addChild(this.player);

        // create zombies
        this.zombies = [];
        for (let i = 0; i < 3; i++) {
            let newZombie = new Zombie((app.screen.width / 4) * (i+1), 75);
            newZombie.setTargetFunc(() => (this.player.position));
            this.zombies.push(newZombie);
            app.stage.addChild(newZombie);
        }

        // start main game loop
        app.ticker.add(delta => {
            this.step(delta);
        });
    }

    step(delta) {
        // sort zombies by distance
        this.zombies.sort((a, b) => a.distToPlayer - b.distToPlayer);
        //console.log(this.zombies[0].distToPlayer, this.zombies[1].distToPlayer, this.zombies[2].distToPlayer);

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
            let projectile = this.player.attack();
            if (projectile != null) {
                this.app.stage.addChild(projectile);
                this.projectiles.push(projectile);
            }
        }

        // check collisions between projectiles and zombies
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].step(delta);

            for (let j = this.zombies.length - 1; j >= 0; j--) {
                if (this.zombies[j].hitTestCircle(this.projectiles[i])) {
                    if (this.zombies[j].damage(this.projectiles[i].damage)) {
                        // remove zombie
                        this.app.stage.removeChild(this.zombies[j]);
                        this.zombies.splice(j, 1);
                    }

                    // remove projectile
                    this.app.stage.removeChild(this.projectiles[i]);
                    this.projectiles.splice(i, 1);
                    break;
                }
            }
        }

    }

    endGame() {
        this.player.die();

        // set all zombies to an idle routine to leave the level bounds
        for (let zombie of this.zombies) {
            let randRadius = this.randomNumber(0, 360) * Math.PI / 180;
            let targetX = Math.cos(randRadius) * this.app.screen.width * 1.2;
            let targetY = Math.sin(randRadius) * this.app.screen.width * 1.2;
            zombie.setTargetFunc(() => {
                return {x: targetX, y: targetY};
            });
        }
    }

    randomNumber(min, max) {
        const r = Math.random() * (max - min) + min;
        return Math.floor(r);
    }
}