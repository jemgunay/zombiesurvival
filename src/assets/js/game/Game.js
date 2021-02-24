import * as PIXI from "pixi.js";
import Victor from "victor"
import Player from "./Player.js"
import Zombie from "./Zombie.js"
import * as Input from "./Input.js"

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

        // load an image and run the `setup` function when it's done
        PIXI.Loader.shared
            .add('player_handgun', 'game/player.json')
            .add('zombie_legs', 'game/zombie_legs.json')
            .add('zombie_torso', 'game/zombie_torso.json')
            .add('large_zombie', 'game/large_zombie.json')
            .load(() => this.setup());
    }

    setup() {
        // create player
        let centerStage = new Victor(this.app.screen.width / 2, this.app.screen.height / 2);
        this.player = new Player(this.app.stage, centerStage.x, centerStage.y)

        // create zombies
        this.zombies = [];
        for (let i = 1; i < 4; i++) {
            this.zombies.push(new Zombie(this.app.stage, new Victor((this.app.screen.width/4)*i, 50)))
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
            zombie.step(delta);
        }
    }
}
