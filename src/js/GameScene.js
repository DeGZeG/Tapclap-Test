import Phaser from 'phaser'
import Field from "./Field";
import MenuButton from "./MenuButton";

let Texts = {
    Turns: 'Ходов осталось:',
    Shuffle: 'Перемешать',
    Bomb: 'Бомба'
}

let Styles = {
    Color: '#002f80',
    WhiteColor: '#FFFFFF',
    Font: 'Marvin'
}

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create () {
        this.fieldBackground = this.add.image(
            this.cameras.main.centerX - 300,
            this.cameras.main.centerY, 'field')
        .setScale(0.3)

        let scorePanel = this.add.image(
            this.cameras.main.centerX + 100,
            this.fieldBackground.getTopCenter().y,
            'scorePanel').setOrigin(0, 0)
        .setScale(0.3)

        this.field = new Field(this.gameSettings)
        this.tileImages = []
        for (let i = 0; i < this.field.fieldRows; i++) {
            this.tileImages.push(new Array(this.field.fieldCols).fill(null))
        }
        this.tileImagesGroup = this.add.group()
        this.fillField()

        this.scoreText = this.add.text(
            scorePanel.getBottomCenter().x,
            scorePanel.getBottomCenter().y - 85,
            'Очки:\n0',
            {font: `32px ${Styles.Font}`, fill: Styles.WhiteColor, align: 'center'}
        ).setOrigin(0.5)

        this.turnsText = this.add.text(
            scorePanel.getTopCenter().x,
            scorePanel.getTopCenter().y + 20,
            Texts.Turns,
            {font: `16px ${Styles.Font}`, fill: Styles.WhiteColor, align: 'center'}
        ).setOrigin(0.5)

        this.turnsCountText = this.add.text(
            scorePanel.getBottomCenter().x,
            scorePanel.getBottomCenter().y - 225,
            this.field.turnsCount,
            {font: `70px ${Styles.Font}`, fill: Styles.WhiteColor, align: 'center'}
        ).setOrigin(0.5)

        let shuffleBonus = this.add.image(
            scorePanel.getTopLeft().x + 80,
            scorePanel.getBottomCenter().y + 100,
            'bonus'
        )
        .setScale(0.4)
        .setInteractive()
        .on('pointerdown', () => {
            if (this.field.shuffleCount > 0) {
                this.shuffleField()
                this.field.shuffleCount -= 1
                shuffleBonusCount.setText(this.field.shuffleCount)
            }
        })

        let shuffleBonusText = this.add.text(
            shuffleBonus.getBottomCenter().x,
            shuffleBonus.getBottomCenter().y - 55,
            Texts.Shuffle,
            {font: `15px ${Styles.Font}`, fill: Styles.WhiteColor, align: 'center'}
        ).setOrigin(0.5)

        let shuffleBonusCount = this.add.text(
            shuffleBonus.getBottomCenter().x,
            shuffleBonus.getBottomCenter().y - 120,
            this.field.shuffleCount,
            {font: `40px ${Styles.Font}`, fill: Styles.WhiteColor, align: 'center'}
        ).setOrigin(0.5)

        let bombBonus = this.add.image(
            scorePanel.getTopRight().x - 80,
            scorePanel.getBottomCenter().y + 100,
            'bonus'
        )
        .setScale(0.4)
        .setInteractive()
        .on('pointerdown', () => {
            if (this.field.bombCount > 0 && !this.field.bombActive) {
                this.field.bombActive = true
                this.field.bombCount -= 1
                bombBonusCount.setText(this.field.bombCount)
            }
        })

        let bombBonusText = this.add.text(
            bombBonus.getBottomCenter().x,
            bombBonus.getBottomCenter().y - 55,
            Texts.Bomb,
            {font: `15px ${Styles.Font}`, fill: Styles.WhiteColor, align: 'center'}
        ).setOrigin(0.5)

        let bombBonusCount = this.add.text(
            bombBonus.getBottomCenter().x,
            bombBonus.getBottomCenter().y - 120,
            this.field.bombCount,
            {font: `40px ${Styles.Font}`, fill: Styles.WhiteColor, align: 'center'}
        ).setOrigin(0.5)



        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (this.tileImagesGroup.contains(gameObject)) {
                let tile = gameObject.data.list
                this.field.bombBonus(tile)

                if (tile.color === 'bomb') {
                    this.burnGroup(this.field.bombBonus(tile))
                }
                else if (this.field.bombActive) {
                    this.burnGroup(this.field.bombBonus(tile))
                    this.field.bombActive = false
                }
                else {
                    this.burnGroup(tile.group)
                }
            }
        }, this)
    }

    createTileImage(tile) {
        let fieldCenter = this.fieldBackground.getCenter()
        let rows = this.field.fieldRows
        let cols = this.field.fieldCols
        let x = fieldCenter.x+tile.i*50-rows*50/2+25
        let y = fieldCenter.y+tile.j*50-cols*50/2+25

        let newTileImage = this.add.image(x, y, tile.color+'Tile')
            .setScale(0)
            .setAlpha(0)
            .setDepth(this.field.fieldCols-tile.j)
            .setData(tile)

        this.tweens.add({
            targets: newTileImage,
            duration: 100,
            ease: 'Linear',
            alpha: 1,
            scaleX: 0.3,
            scaleY: 0.3,
            onComplete: () => {
                newTileImage.setInteractive()
            }
        });

        return newTileImage
    }

    fillField() {
        for (let i = 0; i < this.field.fieldRows; i++) {
            for (let j = 0; j < this.field.fieldCols; j++) {
                if (this.tileImages[i][j] === null) {
                    let tile = this.field.field[i][j]
                    let newTileImage = this.createTileImage(tile)
                    this.tileImages[i][j] = newTileImage
                    this.tileImagesGroup.add(newTileImage)
                }
                else {
                    this.tileImages[i][j].setData(this.field.field[i][j])
                }
            }
        }
    }

    burnGroup(group) {
        if (group.count >= this.field.minGroup) {
            this.tileImagesGroup.getChildren().map(tileImage => tileImage.disableInteractive())

            let imagesGroup = this.add.group()

            for (let k = 0; k < group.count; k++) {
                let tile = group.tiles[k]
                let i = tile.i, j = tile.j
                imagesGroup.add(this.tileImages[i][j])
                this.tileImages[i][j] = null
            }

            this.field.burnGroup(group)

            let tween = this.tweens.add({
                targets: imagesGroup.getChildren(),
                duration: 200,
                ease: 'Linear',
                alpha: 0,
                scaleX: 0,
                scaleY: 0,
                onComplete: () => {
                    imagesGroup.clear(true, true)
                    let fallInfo = this.field.fallTiles()
                    this.fallTiles(fallInfo)
                    tween.remove()

                    let maxGroup = 0
                    for (let i = 0; i < this.field.groups.length; i++) {
                        if (this.field.groups[i].count > maxGroup) maxGroup = this.field.groups[i].count
                    }

                    if (this.field.score >= this.field.pointsToWin) {
                        this.endGame('win')
                    }
                    else if (this.field.shuffleCount === 0 && maxGroup < this.field.bombGroup || this.field.turnsCount === 0) {
                        this.endGame('lose')
                    }
                }
            });

            this.field.turnsCount -= 1
            this.turnsCountText.setText(this.field.turnsCount)

            this.scoreText.setText(`Очки:\n${this.field.score}`)
        }
    }

    fallTiles(info) {
        let maxDist = 0
        for (let k = 0; k < info.length; k++) {
            let i = info[k].i, j = info[k].j, dist = info[k].dist
            if (dist > maxDist) maxDist = dist
            let tileImage = this.tileImages[i][j]
            this.tileImages[i][j] = null
            this.tileImages[i][j+dist] = tileImage

            tileImage.setDepth(this.field.fieldCols-(j+dist))

            let tween = this.tweens.add({
                targets: tileImage,
                duration: dist*100,
                ease: 'Linear',
                y: `+=${dist*50}`,
                onComplete: () => {
                    tween.remove()
                }
            })
        }

        setTimeout(() => {
            this.fillField()
            this.tileImagesGroup.getChildren().map(tileImage => tileImage.setInteractive())
        }, maxDist*100)
    }

    shuffleField() {
        this.tileImages = []
        for (let i = 0; i < this.field.fieldRows; i++) {
            this.tileImages.push(new Array(this.field.fieldCols).fill(null))
        }

        let tween = this.tweens.add({
            targets: this.tileImagesGroup.getChildren(),
            duration: 200,
            ease: 'Linear',
            alpha: 0,
            scaleX: 0,
            scaleY: 0,
            onComplete: () => {
                this.field.shuffleField()
                this.fillField()
                tween.remove()
            }
        });
    }

    endGame(result) {
        let text
        if (result === 'win') {
            text = 'Вы победили!'
        }
        else text = 'Вы проиграли..'

        let resultText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - window.innerHeight - 300,
            text,
            {font: `52px ${Styles.Font}`, fill: Styles.Color}
        ).setOrigin(0.5)

        let newGame = new MenuButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY - window.innerHeight - 100,
            'Заново',
            {font: `26px ${Styles.Font}`, fill: Styles.WhiteColor},
            true
        )
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Game')
        })

        let toMenu = new MenuButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY - window.innerHeight - 30,
            'В меню',
            {font: `26px ${Styles.Font}`, fill: Styles.WhiteColor},
            true
        )
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Menu')
        })

        let tween = this.tweens.add({
            targets: this.cameras.main,
            duration: 1000,
            ease: 'Bounce',
            scrollY: -window.innerHeight,
        });
    }
}

