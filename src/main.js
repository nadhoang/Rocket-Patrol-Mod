// Name: Nathan Hoang
// Title: 
// Time: 5 hours
// --- MODS ---
// -- 1-Point Tier --
// [] Track a high score that persists across scenes and display it in the UI (1)
// [] Implement the 'FIRE' UI text from the original game (1)
// [] Add your own (copyright-free) looping background music to the Play scene (keep the volume low and be sure that multiple instances of your music don't play when the game restarts) (1)
// [] Implement the speed increase that happens after 30 seconds in the original game (1)
// [] Randomize each spaceship's movement direction at the start of each play (1)
// [] Create a new scrolling tile sprite for the background (1)
// [] Allow the player to control the Rocket after it's fired (1)
// -- 3-Point Tier --
// [] Create 4 new explosion sound effects and randomize which one plays on impact (3)
// [] Display the time remaining (in seconds) on the screen (3)
// [] Using a texture atlas, create a new animated sprite (three frames minimum) for the enemy spaceships (3)
// [] Create a new title screen (e.g., new artwork, typography, layout) (3)
// [] Implement parallax scrolling for the background (3)
// -- 5-Point Tier --
// [] Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
// [] Implement an alternating two-player mode (5)
// [] Implement a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses (5)
// [] Implement mouse control for player movement and left mouse click to fire (5)
// [] Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (5)

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config)

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT