import * as PIXI from "pixi.js";
import Victor from "victor"
import Player from "./Player.js"
import Zombie from "./Zombie.js"
import * as Input from "./Input.js"
import * as ResourceManager from "./ResourceManager.js"

export default class Game {
    constructor(container) {
        let app = new PIXI.Application({
            width: container.clientWidth,
            height: container.clientHeight,
            backgroundColor: 0x2c3e50,
            antialias: true
        });
        container.appendChild(app.view);
        app.stage.hitArea = app.screen;
        app.stage.interactive = true;
        Input.setStage(app.stage);

        // load all required resources
        ResourceManager.Load(() => {
            this.setup(app);
        });
    }

    setup(app) {
        // create player
        let centerStage = new Victor(app.screen.width / 2, app.screen.height / 2);
        this.player = new Player(centerStage);
        app.stage.addChild(this.player);

        // create zombies
        this.zombies = [];
        for (let i = 1; i < 4; i++) {
            let newZombie = new Zombie(new Victor((app.screen.width/4)*i, 75))
            this.zombies.push(newZombie);
            app.stage.addChild(newZombie);
        }

        // listen for mouse click
        app.stage
            .on('mousedown', () => this.player.shoot())
            .on('pointerdown', () => this.player.shoot());

        // start main game loop
        app.ticker.add(delta => this.update(delta));
    }

    update(delta) {
        this.player.step(delta);

        // move zombies towards player
        for (let zombie of this.zombies) {
            zombie.step(delta, this.player.position);
            if (this.player.hitTestCircle(zombie)) {
                this.player.die();
            }
        }
    }
}
