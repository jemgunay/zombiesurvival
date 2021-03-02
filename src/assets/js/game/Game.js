import * as PIXI from "pixi.js";
import World from "./World.js"
import * as Input from "./Input.js"
import * as ResourceManager from "./ResourceManager.js"

export default class Game {
    constructor(container) {
        // configure game
        let app = new PIXI.Application({
            width: container.clientWidth,
            height: container.clientHeight,
            backgroundColor: 0x2c3e50,
            antialias: true
        });
        container.appendChild(app.view);
        app.stage.hitArea = app.screen;
        app.stage.interactive = true;
        // set up input listeners
        Input.Init(app.stage);

        // load all required resources
        ResourceManager.Load(() => {
            this.world = new World(app);
        });
    }
}
