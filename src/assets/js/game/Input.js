// handle keyboard input
export const KeyA = 'a';
export const KeyD = 'd';
export const KeyW = 'w';
export const KeyS = 's';
export const KeyLeft = 'ArrowLeft';
export const KeyRight = 'ArrowRight';
export const KeyUp = 'ArrowUp';
export const KeyDown = 'ArrowDown';

let keyLookup = {
    KeyA: false,
    KeyD: false,
    KeyW: false,
    KeyS: false,
    KeyLeft: false,
    KeyRight: false,
    KeyUp: false,
    KeyDown: false,
}

export function isKeyPressed(key) {
    return keyLookup[key];
}

// handle mouse input
let mousePosition = {x: 0, y: 0}

export function getMousePosition() {
    return mousePosition
}

// set up listeners
export function setStage(stage) {
    // listen for handle key presses
    window.addEventListener('keydown', event => {
        keyLookup[event.key] = true;
    }, false);

    // listen for key releases
    window.addEventListener('keyup', event => {
        keyLookup[event.key] = false;
    }, false);

    // listen for mouse movement
    stage.on('mousemove', (event) => {
        mousePosition.x = event.data.global.x;
        mousePosition.y = event.data.global.y;
    });
}