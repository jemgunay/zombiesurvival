import * as PIXI from "pixi.js";
import {Game} from "./Game";

const numericLookup = {
    1: "st",
    2: "nd",
    3: "rd",
    4: "th",
    5: "th",
    6: "th",
    7: "th",
    8: "th",
    9: "th",
    10: "th",
};

export default class UI extends PIXI.Container {
    constructor() {
        super();

        let textStyle = new PIXI.TextStyle({
            fontFamily: "Conv_ds-zombie-cyr",
            fontSize: 26,
            fill: 0xFFFFFF,
            stroke: "#000000",
            strokeThickness: 5,
        });

        // create level text
        this.roundText = new PIXI.Text("", textStyle);
        this.roundText.x = 20;
        this.roundText.y = 20;
        this.setRoundText(1);
        this.addChild(this.roundText);

        // create weapon text
        this.weaponText = new PIXI.Text("", textStyle);
        this.addChild(this.weaponText);
        // create ammo text
        this.ammoText = new PIXI.Text("", textStyle);
        this.addChild(this.ammoText);

        // create kill counter text
        this.killCountText = new PIXI.Text("", textStyle);
        this.killCount = -1;
        this.addChild(this.killCountText);
        this.incrementKillCounter();

        // move to front
        this.zIndex = 10;
    }

    setRoundText(round) {
        this.roundText.text = round + numericLookup[round] + " Wave";
    }

    incrementKillCounter() {
        this.killCount++;
        this.killCountText.text = this.killCount + " Kills";
        this.killCountText.x = Game.app.screen.width - this.killCountText.width - 20;
        this.killCountText.y = 20;
    }

    setAmmoText(weaponName, loaded, unloaded) {
        this.weaponText.text = weaponName;
        this.weaponText.x = Game.app.screen.width - this.weaponText.width - 20;
        this.weaponText.y = Game.app.screen.height - this.weaponText.height - 60;

        this.ammoText.text = loaded + " / " + unloaded;
        this.ammoText.x = Game.app.screen.width - this.ammoText.width - 20;
        this.ammoText.y = Game.app.screen.height - this.ammoText.height - 20;
    }
}