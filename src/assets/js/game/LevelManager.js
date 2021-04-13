import * as Util from "./Util";
import {Game} from "./Game";

export default class LevelManager {
    constructor() {
        this.levels = [
            {
                zombieCount: 3,
                spawnTime: {min: 2000, max: 2200},
                zombieSpeed: 0.6,
            },
            {
                zombieCount: 7,
                spawnTime: {min: 1300, max: 2000},
                zombieSpeed: 0.6,
            },
            {
                zombieCount: 12,
                spawnTime: {min: 900, max: 1400},
                zombieSpeed: 0.7,
            },
            {
                zombieCount: 25,
                spawnTime: {min: 800, max: 1100},
                zombieSpeed: 0.7,
            },
            {
                zombieCount: 35,
                spawnTime: {min: 750, max: 900},
                zombieSpeed: 0.8,
            },
        ];
        this.currentLevelNum = 0;
    }

    next() {
        if (this.currentLevelNum === this.levels.length) {
            return;
        }
        this.currentLevelNum++;
        this.currentLevel = this.levels[this.currentLevelNum - 1];
        Game.ui.setRoundText(this.currentLevelNum);
        this.tick();
    }

    tick() {
        setTimeout(() => {
            this.currentLevel.zombieCount--;
            this.readyToSpawn = true;
        }, Util.RandomInt(this.currentLevel.spawnTime.min, this.currentLevel.spawnTime.max));
    }

    shouldSpawn() {
        if (this.readyToSpawn) {
            this.readyToSpawn = false;
            if (this.currentLevel.zombieCount > 0) {
                this.tick();
            }
            return true;
        }
        return false;
    }
}