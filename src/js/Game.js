import Phaser from 'phaser'
import Tile from "./Tile";
import TileGroup from "./TileGroup";

export default class Game {
    constructor() {
        this.colorsCount= 5
        this.fieldCols = 7
        this.fieldRows = 7
        this.field = []
        for (let i = 0; i < this.fieldRows; i++) {
            this.field.push(new Array(this.fieldCols).fill(null))
        }
        this.fillField()

        this.score = 0
    }

    randomColor() {
        switch(Math.floor(Math.random() * this.colorsCount)){
            case 0: return 'blue'
            case 1: return 'green'
            case 2: return 'purple'
            case 3: return 'red'
            case 4: return 'yellow'
        }
    }

    burnGroup(group) {
        for (let k = 0; k < group.count; k++) {
            let tile = group.tiles[k]
            let i = tile.i, j = tile.j
            this.field[i][j] = null
        }

        switch (group.count) {
            case 1: this.score += 1; break
            case 2: case 3: case 4: this.score += group.count * 3; break
            case 5: case 6: case 7: this.score += group.count * 5; break
            case 8: case 9: case 10: this.score += group.count * 7; break
            default: this.score += group.count * 10
        }

        group.deleteGroup()
    }

    fillField() {
        for (let i = 0; i < this.fieldRows; i++) {
            for (let j = 0; j < this.fieldCols; j++) {
                if (this.field[i][j] === null) {
                    let color = this.randomColor()
                    this.field[i][j] = new Tile(i, j, color, new TileGroup())
                }
                else this.field[i][j].group = new TileGroup(this.field[i][j])
            }
        }

        this.findGroups()
    }

    fallTiles() {
        let info = []

        for (let i = 0; i < this.fieldRows; i++) {
            for (let j = this.fieldCols-1; j >= 0; j--) {
                if (this.field[i][j] === null) {
                    for (let k = j-1; k >= 0; k--) {
                        if (this.field[i][k] !== null) {
                            this.field[i][j] = this.field[i][k]
                            this.field[i][k] = null
                            this.field[i][j].j = j
                            info.push({i: i, j: k, dist: j-k})
                            break
                        }
                    }
                }
            }
        }

        return info
    }

    findGroups() {
        for (let i = 0; i < this.fieldRows; i++) {
            for (let j = 0; j < this.fieldCols; j++) {
                let tile = this.field[i][j]
                //верх
                if (i !== 0 && this.field[i - 1][j] !== null) {
                    let topTile = this.field[i - 1][j]
                    if (topTile.color === tile.color) topTile.group.mergeGroups(tile.group)
                }
                //низ
                if (i !== this.fieldRows - 1 && this.field[i + 1][j] !== null) {
                    let bottomTile = this.field[i + 1][j]
                    if (bottomTile.color === tile.color) bottomTile.group.mergeGroups(tile.group)
                }
                //лево
                if (j !== 0 && this.field[i][j - 1] !== null) {
                    let leftTile = this.field[i][j - 1]
                    if (leftTile.color === tile.color) leftTile.group.mergeGroups(tile.group)
                }
                //право
                if (j !== this.fieldCols - 1 && this.field[i][j + 1] !== null) {
                    let rightTile = this.field[i][j + 1]
                    if (rightTile.color === tile.color) rightTile.group.mergeGroups(tile.group)
                }
            }
        }
    }

}