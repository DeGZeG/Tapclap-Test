import Tile from "./Tile";
import TileGroup from "./TileGroup";

export default class Field {
    constructor(settings) {
        this.turnsCount = settings.turnsCount
        this.pointsToWin = settings.pointsToWin
        this.fieldRows = settings.fieldRows
        this.fieldCols = settings.fieldCols
        this.colorsCount = settings.colorsCount
        this.minGroup = settings.minGroup
        this.shuffleCount = settings.shuffleCount

        this.bombRadius = settings.bombRadius
        this.bombCount = settings.bombCount
        this.bombGroup = settings.bombGroup
        this.bombActive = false

        this.field = []
        for (let i = 0; i < this.fieldRows; i++) {
            this.field.push(new Array(this.fieldCols).fill(null))
        }
        this.fillField()
        this.groups = []

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
        if (group.count >= this.minGroup) {
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
    }

    fillField() {
        for (let i = 0; i < this.fieldRows; i++) {
            for (let j = 0; j < this.fieldCols; j++) {
                if (this.field[i][j] === null) {
                    let color = this.randomColor()
                    this.field[i][j] = new Tile(i, j, color, new TileGroup())
                }
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

        this.fillField()

        return info
    }

    shuffleField() {
        let tiles = []
        for (let i = 0; i < this.fieldRows; i++) {
            tiles = [...tiles, ...this.field[i]]
        }

        function getRandomInt(min, max){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let shuffledTiles = []
        for (let i = 0; i < tiles.length; i++) {
            let num = getRandomInt(shuffledTiles.length, tiles.length-1)
            shuffledTiles.push(tiles[num])
            let temp = tiles[i]
            tiles[i] = tiles[num]
            tiles[num] = temp
        }

        let k = 0
        for (let i = 0; i < this.fieldRows; i++) {
            for (let j = 0; j < this.fieldCols; j++) {
                let tile = shuffledTiles[k]
                tile.i = i
                tile.j = j
                this.field[i][j] = tile
                k++
            }
        }

        this.findGroups()
    }

    findGroups() {
        for (let i = 0; i < this.fieldRows; i++) {
            for (let j = 0; j < this.fieldCols; j++) {
                this.field[i][j].group = new TileGroup(this.field[i][j])
            }
        }

        for (let i = 0; i < this.fieldRows; i++) {
            for (let j = 0; j < this.fieldCols; j++) {
                let tile = this.field[i][j]
                //top
                if (i !== 0 && this.field[i - 1][j] !== null) {
                    let topTile = this.field[i - 1][j]
                    if (topTile.color === tile.color) topTile.group.mergeGroups(tile.group)
                }
                //bottom
                if (i !== this.fieldRows - 1 && this.field[i + 1][j] !== null) {
                    let bottomTile = this.field[i + 1][j]
                    if (bottomTile.color === tile.color) bottomTile.group.mergeGroups(tile.group)
                }
                //left
                if (j !== 0 && this.field[i][j - 1] !== null) {
                    let leftTile = this.field[i][j - 1]
                    if (leftTile.color === tile.color) leftTile.group.mergeGroups(tile.group)
                }
                //right
                if (j !== this.fieldCols - 1 && this.field[i][j + 1] !== null) {
                    let rightTile = this.field[i][j + 1]
                    if (rightTile.color === tile.color) rightTile.group.mergeGroups(tile.group)
                }
            }
        }

        this.groups = []
        for (let i = 0; i < this.fieldRows; i++) {
            for (let j = 0; j < this.fieldCols; j++) {
                if (!this.groups.includes(this.field[i][j].group))
                    this.groups.push(this.field[i][j].group)
            }
        }
    }

    bombBonus(tile) {
        let bombGroup = new TileGroup()
        for (let i = 0; i < this.fieldRows; i++) {
            for (let j = 0; j < this.fieldCols; j++) {
                if (Math.abs(i-tile.i) <= this.bombRadius && Math.abs(j-tile.j) <= this.bombRadius) {
                    bombGroup.addTile(this.field[i][j])
                }
            }
        }

        return bombGroup
    }

    setBomb(i, j) {
        this.field[i][j] = new Tile(i, j, 'bomb', new TileGroup())
    }
}