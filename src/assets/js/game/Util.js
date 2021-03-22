export function DegToRad(deg) {
    return deg * Math.PI/180;
}

export function RadToDeg(rad) {
    return rad * 180/Math.PI;
}

export function RandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function RandomBool() {
    return RandomNumber(0, 1) === 0;
}