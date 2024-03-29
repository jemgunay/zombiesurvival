# Zombie Survival

[![CircleCI](https://circleci.com/gh/jemgunay/zombiesurvival/tree/master.svg?style=svg)](https://circleci.com/gh/jemgunay/zombiesurvival/tree/master)

Survive as many waves of zombies as you can... [Play here!](https://jemgunay.co.uk/zombiesurvival)

<p align="center">
  <img src="/screenshots/screenshot_1.png" width="30%"/>
  <img src="/screenshots/screenshot_2.png" width="30%"/>
  <img src="/screenshots/screenshot_3.png" width="30%"/>
</p>

## Usage

```bash
# run locally
npm install
npm run serve
# build dist for release
npm run build
# lint
npm run lint
npm run lint-fix
```

## TODO

### Features

* Sounds
    * Zombie moans
    * Ambient sounds
* Chunky zombies
* Player sprites for different weapons (2/3, shotgun remaining)
* Grenade/rocket launcher
* Start game on focus
* Redesign aim to point rifle directly at cursor (machine gun is currently offset) 

### Bugs

* Fix zombie rotation issue (travel clockwise around zombie and they ping to face anticlockwise)
