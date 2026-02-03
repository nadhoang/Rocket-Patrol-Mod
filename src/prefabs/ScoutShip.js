// ScoutShip prefab
class ScoutShip extends Spaceship {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame, pointValue)

        this.setScale(0.75) // size

        this.moveSpeed = Math.round(game.settings.spaceshipSpeed * 1.75) // speed
    }
}
