import Phaser from 'phaser'
import Game from "./Game";

let game = new Game()

let phaser = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    scene: {
        preload,
        create,
        update,
        extend: {
            createTileImage,
            fillField,
            burnGroup,
            fallTiles,
        }
    },
})

let tileImages = []
for (let i = 0; i < game.fieldRows; i++) {
    tileImages.push(new Array(game.fieldCols).fill(null))
}
let tileImagesGroup

function preload() {
    this.load.image('blueTile', '../img/blue.png')
    this.load.image('greenTile', '../img/green.png')
    this.load.image('purpleTile', '../img/purple.png')
    this.load.image('redTile', '../img/red.png')
    this.load.image('yellowTile', '../img/yellow.png')
}

function create () {
    tileImagesGroup = this.add.group()
    this.fillField()

    this.input.on('gameobjectdown', function (pointer, gameObject) {
        let tile = gameObject.data.list
        let group = tile.group
        this.burnGroup(group)
    }, this);
}

function update () {

}

function createTileImage(tile) {
    let newTileImage = this.add.image(tile.i*50, tile.j*50, tile.color+'Tile')
        .setOrigin(0, 0)
        .setScale(0)
        .setAlpha(0)
        .setDepth(game.fieldCols-tile.j)
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

function fillField() {
    for (let i = 0; i < game.fieldRows; i++) {
        for (let j = 0; j < game.fieldCols; j++) {
            if (tileImages[i][j] === null) {
                let tile = game.field[i][j]
                let newTileImage = this.createTileImage(tile)
                tileImages[i][j] = newTileImage
                tileImagesGroup.add(newTileImage)
            }
            else {
                tileImages[i][j].setData(game.field[i][j])
            }
        }
    }
}

function burnGroup(group) {
    tileImagesGroup.getChildren().map(tileImage => tileImage.disableInteractive())

    let imagesGroup = this.add.group()

    for (let k = 0; k < group.count; k++) {
        let tile = group.tiles[k]
        let i = tile.i, j = tile.j
        imagesGroup.add(tileImages[i][j])
        tileImages[i][j] = null
    }

    game.burnGroup(group)

    let tween = this.tweens.add({
        targets: imagesGroup.getChildren(),
        duration: 200,
        ease: 'Linear',
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        onComplete: () => {
            imagesGroup.clear(true, true)
            let fallInfo = game.fallTiles()
            this.fallTiles(fallInfo)
            tween.remove()
        }
    });
}

function fallTiles(info) {
    for (let k = 0; k < info.length; k++) {
        let i = info[k].i, j = info[k].j, dist = info[k].dist
        let tileImage = tileImages[i][j]
        tileImages[i][j] = null
        tileImages[i][j+dist] = tileImage

        tileImage.setDepth(game.fieldCols-(j+dist))

        let tween = this.tweens.add({
            targets: tileImage,
            duration: 200,
            ease: 'Linear',
            y: `+=${dist*50}`,
            onComplete: () => {
                tween.remove()
            }
        })
    }

    setTimeout(() => {
        game.fillField()
        this.fillField()
        tileImagesGroup.getChildren().map(tileImage => tileImage.setInteractive())
    }, 200)
}