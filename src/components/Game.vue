<template>
    <div id="container">
        <p id="loading-text"></p>
        <div id="game"></div>
        <div id="controls">
            <div class="control-pane">
                <p>Move - WASD</p>
                <p>Reload - R</p>
                <p><a href="https://github.com/jemgunay/zombiesurvival" target="_blank">GitHub</a></p>
            </div>
            <div class="control-pane" id="control-pane-right">
                <p>Q - Previous Weapon</p>
                <p>E - Next Weapon</p>
                <p>1/2/3 - Switch Weapon</p>
            </div>
        </div>
    </div>
</template>

<script>
import {Game} from "@/assets/js/game/Game.js";

export default {
    name: "Game",
    mounted() {
        // loading text ellipsis
        let loadingText = document.getElementById("loading-text");
        let dotCount = 0;
        setInterval(function () {
            if (dotCount === 3) {
                dotCount = 0;
            } else {
                dotCount++;
            }
            loadingText.innerHTML = "Loading" + ".".repeat(dotCount);
        }, 500);

        // start game
        this.container = document.getElementById("game");
        Game.init(this.container);
    }
};
</script>

<style scoped>
    #game {
        width: 720px;
        height: 480px;
        margin-left: auto;
        margin-right: auto;
    }

    #loading-text {
        position: absolute;
        z-index: -1;
        top: 32%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: "ds-zombie-cyr";
        font-size: 1.5em;
    }

    #controls {
        text-align: center;
    }

    .control-pane {
        display: inline-block;
        width: 200px;
        text-align: right;
        vertical-align: top;
    }

    .control-pane:nth-child(2) {
        text-align: left;
    }

    p {
        color: #FFFFFF;
        margin: 10px 15px;
        /* prevent text from being highlighted */
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .control-pane a, .control-pane a:hover, .control-pane a:visited {
        color: #FFFFFF;
    }

    .control-pane a:hover {
        color: #838383;
    }
</style>
