import Phaser from 'phaser'
import Game from "../Game";
import MenuButton from "../PhaserComponents/MenuButton";
import ScorePanel from "../PhaserComponents/ScorePanel";
import Bonus from "../PhaserComponents/Bonus";

const TILE_SIZE = 50

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.myGame = new Game(this.gameSettings)

        //Field ------------------------------------------------
        this.fieldBackground = this.add.image(
            this.cameras.main.centerX - 300,
            this.cameras.main.centerY,
            'field')
            .setScale(0.3)
        this.tilesFieldMask = new Phaser.Display.Masks.BitmapMask(this, this.fieldBackground)
        //-------------------------------------------------------

        //Score and bonuses -------------------------------------
        this.scorePanel = new ScorePanel(
            this,
            this.cameras.main.centerX + 100,
            this.fieldBackground.getTopCenter().y,
            'scorePanel',
            this.myGame.turnsCount
        )

        const bonusesY = this.scorePanel.getBottomCenter().y + 100
        this.shuffleBonus = new Bonus(
            this,
            this.scorePanel.getTopLeft().x + 80,
            bonusesY,
            'bonus',
            'Перемешать',
            this.myGame.shuffleCount
        )
        .on('pointerdown', () => {
            if (this.myGame.shuffleCount > 0) {
                this.shuffleField()
                this.myGame.shuffleCount -= 1
                this.shuffleBonus.setCount(this.myGame.shuffleCount)
            }
        })

        this.bombBonus = new Bonus(
            this,
            this.scorePanel.getTopRight().x - 80,
            bonusesY,
            'bonus',
            'Бомба',
            this.myGame.bombCount
        )
        .on('pointerdown', () => {
            if (this.myGame.bombCount > 0 && !this.myGame.bombActive) {
                this.bombBonus.toggleActive()
            }
        })
        //--------------------------------------------------------

        //End game menu ------------------------------------------
        const endgameX = this.cameras.main.centerX
        const endgameY = this.cameras.main.centerY - window.innerHeight
        const endgameButtonsStyle = {font: '26px Marvin', fill: '#FFFFFF'}

        this.resultText = this.add.text(
            endgameX,
            endgameY - 300,
            'Результат',
            {font: '52px Marvin', fill: '#002f80'}
        ).setOrigin(0.5)

        const newGame = new MenuButton(
            this, endgameX, endgameY - 100,
            'Заново',
            endgameButtonsStyle,
            true
        )
        .on('pointerdown', () => {
            this.scene.start('Game')
        })

        const toMenu = new MenuButton(
            this, endgameX, endgameY - 30,
            'В меню',
            endgameButtonsStyle,
            true
        )
        .on('pointerdown', () => {
            this.scene.start('Menu')
        })
        //---------------------------------------------------------

        // Init ---------------------------------------------------
        this.tileImagesGroup = this.add.group()
        this.tileImages = []
        for (let i = 0; i < this.myGame.fieldCols; i++) {
            this.tileImages.push(new Array(this.myGame.fieldRows).fill(null))
        }

        const fieldCenter = this.fieldBackground.getCenter()
        const cols = this.myGame.fieldCols
        const rows = this.myGame.fieldRows
        this.tileOrigin = {}
        this.tileOrigin.x = fieldCenter.x - cols*TILE_SIZE/2 + TILE_SIZE/2
        this.tileOrigin.y = fieldCenter.y - rows*TILE_SIZE/2 + TILE_SIZE/2

        this.fillField()
        // --------------------------------------------------------

        // Tiles click handler
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (this.tileImagesGroup.contains(gameObject)) {
                let tile = gameObject.data.list.tile

                if (tile.type === 'bomb') {
                    this.burnTilesGroup(this.myGame.bombBonus(tile))
                }
                else if (this.bombBonus.isActive) {
                    const bombTile = this.myGame.setBomb(tile.i, tile.j)
                    this.burnTilesGroup(this.myGame.bombBonus(bombTile))
                    this.myGame.bombCount -= 1
                    this.bombBonus.setCount(this.myGame.bombCount)
                    this.bombBonus.toggleActive()
                }
                else {
                    this.burnTilesGroup(tile)
                }
            }
        }, this)
    }

    calcTileImagePosition(tile) {
        const x = this.tileOrigin.x + tile.i * TILE_SIZE
        const y = this.tileOrigin.y + tile.j * TILE_SIZE
        return {x, y}
    }

    createTileImage(tile, dist) {
        return new Promise(resolve => {
            let {x, y} = this.calcTileImagePosition(tile)

            let startY = y - TILE_SIZE*(dist - tile.j) - Math.abs(y - this.fieldBackground.getTopCenter().y) - TILE_SIZE/2

            const newTileImage = this.add.image(x, startY, tile.type + 'Tile')
                .setScale(0.3)
                .setDepth(this.myGame.fieldRows - tile.j)
                .setData({tile})
                .setMask(this.tilesFieldMask)

            resolve({tileImage: newTileImage, dist: Math.abs(startY - y)})
        })
    }

    createSuperTileImage(tile) {
        return new Promise(resolve => {
            const {x, y} = this.calcTileImagePosition(tile)

            let newSuperTileImage = this.add.image(x, y, tile.type + 'Tile')
                .setScale(0.5)
                .setAlpha(0)
                .setDepth(this.myGame.fieldRows)
                .setData({tile})
                .setMask(this.tilesFieldMask)

            this.tweens.add({
                targets: newSuperTileImage,
                duration: 300,
                ease: 'Bounce',
                alpha: 1,
                scaleX: 0.3,
                scaleY: 0.3,
                onComplete: () => {
                    resolve(newSuperTileImage)
                }
            });
        })
    }

    fallTileImage(tileImage, dist) {
        return new Promise(resolve => {
            this.tweens.add({
                targets: tileImage,
                duration: dist,
                ease: 'Linear',
                y: `+=${dist}`,
                onComplete: () => {
                    resolve()
                }
            })
        })
    }

    async fillField(tiles) {
        const fallInfo = this.myGame.fallTiles()
        const fallPromises = []

        //сначала обрабатываем падение тайлов, которые остались на столе
        for (let k = 0; k < fallInfo.length; k++) {
            const i = fallInfo[k].i, j = fallInfo[k].j, dist = fallInfo[k].dist

            const tileImage = this.tileImages[i][j]
            this.tileImages[i][j] = null
            this.tileImages[i][j+dist] = tileImage

            tileImage.setDepth(this.myGame.fieldRows-(j+dist))
            fallPromises.push(this.fallTileImage(tileImage, dist * TILE_SIZE))
        }

        //потом добавляем новые тайлы
        if (!tiles) tiles = this.myGame.fillField()
        const fillPromises = []

        for (let k = 0; k < this.myGame.fieldCols; k++) {
            const col = tiles.filter(tile => tile.i === k)
            col.map(tile => fillPromises.push(this.createTileImage(tile, col.length)))
        }

        const tileImagesInfo = await Promise.all(fillPromises)

        //а потом обрабатываем падение новых
        tileImagesInfo.map(tileImageInfo => {
            const tileImage = tileImageInfo.tileImage, dist = tileImageInfo.dist
            const tile = tileImage.data.list.tile
            this.tileImages[tile.i][tile.j] = tileImage
            this.tileImagesGroup.add(tileImage)
            fallPromises.push(this.fallTileImage(tileImage, dist))
        })

        //ждем пока и новые и старые упадут
        await Promise.all(fallPromises)

        const maxGroup = this.myGame.getMaxGroup()
        if (this.myGame.score >= this.myGame.pointsToWin) {
            this.endGame('win')
        }
        else if (this.myGame.shuffleCount === 0 && maxGroup < this.myGame.minGroup || this.myGame.turnsCount === 0) {
            this.endGame('lose')
        }
        else {
            this.tileImagesGroup.getChildren().map(tileImage => tileImage.setInteractive())
            this.shuffleBonus.setInteractive()
        }
    }

    burnTilesGroup(tile) {
        const i = tile.i, j = tile.j
        const group = tile.group
        const groupCount = group.count
        let withBomb = false

        if (groupCount >= this.myGame.minGroup) {
            this.tileImagesGroup.getChildren().map(tileImage => tileImage.disableInteractive())
            this.shuffleBonus.disableInteractive()

            const imagesGroupToBurn = this.add.group()
            for (let k = 0; k < groupCount; k++) {
                const tile = group.tiles[k]
                const i = tile.i, j = tile.j
                imagesGroupToBurn.add(this.tileImages[i][j])
                this.tileImages[i][j] = null
                if (tile.type === 'bomb') withBomb = true
            }

            this.myGame.burnGroup(group)

            this.tweens.add({
                targets: imagesGroupToBurn.getChildren(),
                duration: 200,
                ease: 'Linear',
                alpha: 0,
                scaleX: 0,
                scaleY: 0,
                onComplete: async () => {
                    imagesGroupToBurn.clear(true, true)

                    if (groupCount >= this.myGame.bombGroup && !withBomb) {
                        this.myGame.setBomb(i, j)
                        const superTileImage = await this.createSuperTileImage(this.myGame.field[i][j])
                        this.tileImagesGroup.add(superTileImage)
                        this.tileImages[i][j] = superTileImage

                    }

                    await this.fillField()
                }
            });

            this.myGame.turnsCount -= 1
            this.scorePanel.setTurnsCount(this.myGame.turnsCount)
            this.scorePanel.setScore(this.myGame.score)
        }
    }

    shuffleField() {
        this.shuffleBonus.disableInteractive()

        this.tileImages = []
        for (let i = 0; i < this.myGame.fieldRows; i++) {
            this.tileImages.push(new Array(this.myGame.fieldCols).fill(null))
        }

        this.tweens.add({
            targets: this.tileImagesGroup.getChildren(),
            duration: 200,
            ease: 'Linear',
            alpha: 0,
            scaleX: 0,
            scaleY: 0,
            onComplete: () => {
                this.tileImagesGroup.clear(true, true)
                const shuffledTiles = this.myGame.shuffleField()
                this.fillField(shuffledTiles)
            }
        });
    }

    endGame(result) {
        if (result === 'win') {
            this.resultText.setText('Вы победили!')
        }
        else this.resultText.setText('Вы проиграли..')

        this.tweens.add({
            targets: this.cameras.main,
            duration: 2000,
            ease: 'Bounce',
            scrollY: -window.innerHeight,
        });
    }
}

