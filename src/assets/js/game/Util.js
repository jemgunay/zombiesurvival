export function DegToRad(deg) {
    return deg * Math.PI/180;
}

export function RadToDeg(rad) {
    return rad * 180/Math.PI;
}

export function RandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function RandomBool() {
    return RandomInt(0, 1) === 0;
}

export function Shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}