import * as PIXI from "pixi.js";
import {Game} from "./Game";

export default class UI extends PIXI.Container {
    constructor() {
        super();

        let textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 26,
            fill: 0xFFFFFF,
        });

        // create level text
        this.roundText = new PIXI.Text("Round 1", textStyle);
        this.roundText.x = 20;
        this.roundText.y = 20;
        this.addChild(this.roundText);

        // create ammo text
        this.ammoText = new PIXI.Text("", textStyle);
        this.ammoText.y = Game.app.screen.height - 50;
        this.addChild(this.ammoText);

        // move to front
        this.zIndex = 10;
    }

    setRoundText(round) {
        this.roundText.text = "Round " + round;
    }

    setAmmoText(loaded, unloaded) {
        this.ammoText.text = loaded + " / " + unloaded;
        this.ammoText.x = Game.app.screen.width - this.ammoText.width - 20;
    }
}