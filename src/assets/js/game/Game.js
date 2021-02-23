import * as PIXI from "pixi.js";
import Player from "./Player.js"
import * as Input from "./Input.js"

export let Stage;

export default class Game {
    constructor(container) {
        this.app = new PIXI.Application({
            width: container.clientWidth,
            height: container.clientHeight,
            backgroundColor: 0x2c3e50
        });
        container.appendChild(this.app.view);
        Stage = this.app.stage
        Input.setStage(Stage);

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
        this.player = new Player(this.app.screen.width / 2, this.app.screen.height / 2)

        // listen for mouse click
        this.app.stage
            .on('mousedown', () => this.player.shoot())
            .on('pointerdown', () => this.player.shoot());

        // start main game loop
        this.app.ticker.add(delta => this.update(delta));
    }

    update(delta) {
        this.player.step(delta)
    }
}
