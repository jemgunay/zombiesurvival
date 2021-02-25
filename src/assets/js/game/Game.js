import * as PIXI from "pixi.js";
import Victor from "victor"
import Player from "./Player.js"
import Zombie from "./Zombie.js"
import * as Input from "./Input.js"
import * as ResourceManager from "./ResourceManager.js"

export default class Game {
    constructor(container) {
        this.app = new PIXI.Application({
            width: container.clientWidth,
            height: container.clientHeight,
            backgroundColor: 0x2c3e50
        });
        container.appendChild(this.app.view);
        this.app.stage.hitArea = this.app.screen;
        this.app.stage.interactive = true;
        Input.setStage(this.app.stage);

        // load all required resources
        ResourceManager.Load(() => {
            this.setup();
        });
    }

    setup() {
        // create player
        let centerStage = new Victor(this.app.screen.width / 2, this.app.screen.height / 2);
        this.player = new Player(this.app.stage, centerStage)

        // create zombies
        this.zombies = [];
        for (let i = 1; i < 4; i++) {
            this.zombies.push(new Zombie(this.app.stage, new Victor((this.app.screen.width/4)*i, 75)))
        }

        // listen for mouse click
        this.app.stage
            .on('mousedown', () => this.player.shoot())
            .on('pointerdown', () => this.player.shoot());

        // start main game loop
        this.app.ticker.add(delta => this.update(delta));
    }

    update(delta) {
        this.player.step(delta)

        // move zombies towards player
        for (let zombie of this.zombies) {
            zombie.step(delta, this.player.sprite.position);
        }
    }
}
