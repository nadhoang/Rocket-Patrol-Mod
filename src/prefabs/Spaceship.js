// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)                        // add to existing scene
        this.points = pointValue                        // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed   // spaceship speed in pixels/frame

        // movement direction (+1 = right, -1 = left)
        // Play scene will randomize this each time a new round starts.
        this.moveDirection = -1
    }

    update() {
        // move spaceship
        this.x += this.moveSpeed * this.moveDirection

        // wrap around screen depending on direction
        if(this.moveDirection < 0 && this.x <= 0 - this.width) {
            this.x = game.config.width
        } else if(this.moveDirection > 0 && this.x >= game.config.width + this.width) {
            this.x = 0 - this.width
        }
    }

    // reset position
    reset() {
        // reset to the opposite side based on direction
        if(this.moveDirection < 0) {
            this.x = game.config.width
        } else {
            this.x = 0 - this.width
        }
    }
}