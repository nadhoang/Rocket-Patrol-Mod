// Name: Nathan Hoang
// Title: Rocket Patrol: Float Point Speed
// Time: ~2.5 hours
// --- MODS ---
// -- 1-Point Tier --
// [X] Track a high score that persists across scenes and display it in the UI (1)
// [X] Implement the 'FIRE' UI text from the original game (1)
// [X] Add your own (copyright-free) looping background music to the Play scene
// -- NOTE: I made the music myself
// (keep the volume low and be sure that multiple instances of your music don't play when the game restarts) (1)
// [X] Randomize each spaceship's movement direction at the start of each play (1)
// -- NOTE: looks a bit wonky if they go opposite direction of their thrusters, oh well
// -- 3-Point Tier --
// [X] Create 4 new explosion sound effects and randomize which one plays on impact (3)
// -- NOTE: Made using jsfxr
// [X] Display the time remaining (in seconds) on the screen (3)
// -- 5-Point Tier --
// [X] Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
// -- New enemy: Scout, moves faster + scales speed relative to difficulty :D
// [X] Implement a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses (5)
// -- NOTE: Lose 1 second for missing, gain 2 for hitting.
// --- Total: 20 ---

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config)

// global variables
game.highScore = 0
game.bgm = null

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT