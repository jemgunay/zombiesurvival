<template>
    <div id="container"></div>
</template>

<script>
    import Game from '@/assets/js/game/Game.js'

    export default {
        name: 'Game',
        mounted() {
            let container = document.getElementById('container');
            this.game = new Game(container);
        }
    }
</script>

<style scoped>
    #container {
        width: 600px;
        height: 400px;
        margin-left: auto;
        margin-right: auto;
    }
</style>
