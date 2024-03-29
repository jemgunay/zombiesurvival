import * as PIXI from "pixi.js";
import World from "./World.js";
import * as Input from "./Input.js";
import * as ResourceManager from "./ResourceManager.js";
import UI from "./UI";
import * as WebFont from "webfontloader";

export let Game = {
    init(container) {
        // ensure font loads before game start
        WebFont.load({
            custom: {
                families: ["ds-zombie-cyr"],
                urls: ["fonts/ds-zombie-cyr.css"]
            },
            active() {
                Game.start(container);
            },
        });
    },

    start(container) {
        // configure game
        this.app = new PIXI.Application({
            width: container.clientWidth,
            height: container.clientHeight,
            transparent: true,
            antialias: true
        });
        container.appendChild(this.app.view);
        this.app.stage.hitArea = this.app.screen;
        this.app.stage.interactive = true;
        this.app.stage.sortableChildren = true;

        // load all required resources
        ResourceManager.Load(() => {
            // set up input listeners
            Input.Init(this.app.stage);

            // set up UI
            this.ui = new UI();
            this.app.stage.addChild(this.ui);

            // start world
            this.world = new World(this.app);
            this.app.stage.addChild(this.world);
        });
    }
};
