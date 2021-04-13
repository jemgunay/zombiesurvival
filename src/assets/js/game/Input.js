// handle keyboard input
export const KeyA = 'A';
export const KeyD = 'D';
export const KeyW = 'W';
export const KeyS = 'S';
export const KeyR = 'R';
export const KeyQ = 'Q';
export const KeyE = 'E';
export const Key1 = '1';
export const Key2 = '2';
export const Key3 = '3';
export const Key4 = '4';
export const Key5 = '5';
export const KeyLeft = 'ARROWLEFT';
export const KeyRight = 'ARROWRIGHT';
export const KeyUp = 'ARROWUP';
export const KeyDown = 'ARROWDOWN';

let keyLookup = {};

export function isKeyPressed(key) {
    if (keyLookup[key] === undefined) {
        keyLookup[key] = false;
    }
    return keyLookup[key];
}

// handle mouse input
let mousePosition = {x: 0, y: 0}
let mouseDown = false;

export function isMouseDown() {
    return mouseDown;
}

export function getMousePosition() {
    return mousePosition
}

// set up listeners
export function Init(stage) {
    // listen for handle key presses
    window.addEventListener('keydown', event => {
        keyLookup[event.key.toUpperCase()] = true;
    }, false);

    // listen for key releases
    window.addEventListener('keyup', event => {
        keyLookup[event.key.toUpperCase()] = false;
    }, false);

    // listen for mouse click
    stage
        .on('mousedown', () => {mouseDown = true})
        .on('pointerdown', () => {mouseDown = true})
        .on('mouseup', () => {mouseDown = false})
        .on('pointerup', () => {mouseDown = false});

    // listen for mouse movement
    stage.on('mousemove', (event) => {
        mousePosition.x = event.data.global.x;
        mousePosition.y = event.data.global.y;
    });
}