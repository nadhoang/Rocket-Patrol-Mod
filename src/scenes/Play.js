class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)

        // --- AUDIO ---
        // music
        if(!game.bgm) {
            game.bgm = this.sound.add('bgm', { loop: true, volume: 0.2 })
            game.bgm.play()
        } else if(!game.bgm.isPlaying) {
            game.bgm.play()
        }

        // explosions sfx
        this.explosionSFXKeys = ['sfx-explosion1', 'sfx-explosion2', 'sfx-explosion3', 'sfx-explosion4']
        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0)

        // add scout (x1)
        this.scout01 = new ScoutShip(this, game.config.width + borderUISize*9, borderUISize*7 + borderPadding*6, 'scout', 0, 50).setOrigin(0, 0)

        // randomize movement direction for each ship at the start of each play
        ;[this.ship01, this.ship02, this.ship03, this.scout01].forEach(ship => {
            ship.moveDirection = Phaser.Math.Between(0, 1) === 0 ? -1 : 1
            ship.reset()
        })

        // initialize score
        this.p1Score = 0

        // initialize high score (persists across scenes via game.highScore)
        this.highScore = game.highScore || 0

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)

        // display high score
        this.highScoreText = this.add.text(game.config.width - borderUISize - borderPadding, borderUISize + borderPadding*2, `HI ${this.highScore}`, scoreConfig).setOrigin(1, 0)

        // FIRE UI text (i got slightly lazy, maybe this still counts? :v)
        scoreConfig.fixedWidth = 0
        this.fireText = this.add.text(game.config.width/2, borderUISize + borderPadding*2, 'FIRE (F)', scoreConfig).setOrigin(0.5, 0)

        // --- TIME + SCORING MECHANIC ---
        this.timeLeftMs = game.settings.gameTimer
        this.hitBonusMs = 2000     // add time on successful hit
        this.missPenaltyMs = 1000  // subtract time on miss

        // display time remaining (seconds)
        this.timeText = this.add.text(game.config.width/2, borderUISize + borderPadding*2 + 32, `TIME ${Math.ceil(this.timeLeftMs/1000)}`, scoreConfig).setOrigin(0.5, 0)

        // GAME OVER flag
        this.gameOver = false    }

    update(time, delta) {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // stop music when returning to menu
            if(game.bgm && game.bgm.isPlaying) {
                game.bgm.stop()
            }
            this.scene.start("menuScene")
        }

        this.starfield.tilePositionX -= 4

        // countdown timer
        if(!this.gameOver) {
            this.timeLeftMs -= delta
            if(this.timeLeftMs <= 0) {
                this.timeLeftMs = 0
                this.endGame()
            }
            this.timeText.text = `TIME ${Math.ceil(this.timeLeftMs/1000)}`
        }

        if(!this.gameOver) {
            this.p1Rocket.update()          // update rocket sprite
            this.ship01.update()            // update spaceships
            this.ship02.update()
            this.ship03.update()
            this.scout01.update()
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }

        if(this.checkCollision(this.p1Rocket, this.scout01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.scout01)
        }
    }

    // called by Rocket when it reaches the top without hitting anything
    onRocketMiss() {
        if(this.gameOver) return
        this.timeLeftMs -= this.missPenaltyMs
        if(this.timeLeftMs < 0) this.timeLeftMs = 0
    }

    endGame() {
        if(this.gameOver) return
        this.gameOver = true

        // update global high score
        if(this.p1Score > (game.highScore || 0)) {
            game.highScore = this.p1Score
            this.highScoreText.text = `HI ${game.highScore}`
        }

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: { top: 5, bottom: 5 },
            fixedWidth: 0
        }

        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5)
    }
    checkCollision(rocket, ship) {
        // AABB checking
        const rW = rocket.displayWidth
        const rH = rocket.displayHeight
        const sW = ship.displayWidth
        const sH = ship.displayHeight

        if (rocket.x < ship.x + sW &&
            rocket.x + rW > ship.x &&
            rocket.y < ship.y + sH &&
            rH + rocket.y > ship.y) {
            return true
            } else {
            return false
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode')              // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset()                        // reset ship position
            ship.alpha = 1                      // make ship visible again
            boom.destroy()                      // remove explosion sprite
        })
        // score add and text update
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score

        // add time for successful hit
        this.timeLeftMs += this.hitBonusMs

        // high score tracking
        if(this.p1Score > this.highScore) {
            this.highScore = this.p1Score
            game.highScore = this.highScore
            this.highScoreText.text = `HI ${this.highScore}`
        }

        // randomize which explosion sound plays
        const sfxKey = Phaser.Utils.Array.GetRandom(this.explosionSFXKeys)
        // debug catch case, if missing explosion sfx, use default
        if(this.cache.audio.exists(sfxKey)) {
            this.sound.play(sfxKey)
        } else {
            this.sound.play('sfx-explosion')
        }
    }
}