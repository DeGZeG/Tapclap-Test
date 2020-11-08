import Tile from "./Tile";
import TileGroup from "./TileGroup";

export default class Game {
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

        // for (let value in settings) {
        //     if (settings.hasOwnProperty(value))
        //         this[value] = settings[value]
        // }

        this.groups = []
        this.field = []
        for (let i = 0; i < this.fieldCols; i++) {
            this.field.push(new Array(this.fieldRows).fill(null))
        }

        this.score = 0
    }

    randomColor() {
        let colors = ['blue', 'green', 'purple', 'red', 'yellow']
        return colors[Math.floor(Math.random() * this.colorsCount)]
    }

    fillField() {
        let addedTiles = []

        for (let i = 0; i < this.fieldCols; i++) {
            for (let j = 0; j < this.fieldRows; j++) {
                if (this.field[i][j] === null) {
                    const color = this.randomColor()
                    const newTile = new Tile(i, j, color, new TileGroup())
                    this.field[i][j] = newTile
                    addedTiles.push(newTile)
                }
            }
        }

        this.findGroups()
        return addedTiles
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

    fallTiles() {
        let info = []

        for (let i = 0; i < this.fieldCols; i++) {
            for (let j = this.fieldRows-1; j >= 0; j--) {
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

    shuffleField() {
        let tiles = []
        for (let i = 0; i < this.fieldCols; i++) {
            tiles = [...tiles, ...this.field[i]]
        }

        function getRandomInt(min, max){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const shuffledTiles = []
        for (let i = 0; i < tiles.length; i++) {
            let num = getRandomInt(shuffledTiles.length, tiles.length-1)
            shuffledTiles.push(tiles[num])
            let temp = tiles[i]
            tiles[i] = tiles[num]
            tiles[num] = temp
        }

        tiles = []
        let k = 0
        for (let i = 0; i < this.fieldCols; i++) {
            for (let j = 0; j < this.fieldRows; j++) {
                let tile = shuffledTiles[k]
                tile.i = i
                tile.j = j
                this.field[i][j] = tile
                tiles.push(tile)
                k++
            }
        }

        this.findGroups()
        return tiles
    }

    findGroups() {
        for (let i = 0; i < this.fieldCols; i++) {
            for (let j = 0; j < this.fieldRows; j++) {
                this.field[i][j].group = new TileGroup(this.field[i][j])
            }
        }

        for (let i = 0; i < this.fieldCols; i++) {
            for (let j = 0; j < this.fieldRows; j++) {
                let tile = this.field[i][j]
                //top
                if (i !== 0 && this.field[i - 1][j] !== null) {
                    let topTile = this.field[i - 1][j]
                    if (topTile.type === tile.type) topTile.group.mergeGroups(tile.group)
                }
                //bottom
                if (i !== this.fieldCols - 1 && this.field[i + 1][j] !== null) {
                    let bottomTile = this.field[i + 1][j]
                    if (bottomTile.type === tile.type) bottomTile.group.mergeGroups(tile.group)
                }
                //left
                if (j !== 0 && this.field[i][j - 1] !== null) {
                    let leftTile = this.field[i][j - 1]
                    if (leftTile.type === tile.type) leftTile.group.mergeGroups(tile.group)
                }
                //right
                if (j !== this.fieldRows - 1 && this.field[i][j + 1] !== null) {
                    let rightTile = this.field[i][j + 1]
                    if (rightTile.type === tile.type) rightTile.group.mergeGroups(tile.group)
                }
            }
        }

        this.groups = []
        for (let i = 0; i < this.fieldCols; i++) {
            for (let j = 0; j < this.fieldRows; j++) {
                if (!this.groups.includes(this.field[i][j].group))
                    this.groups.push(this.field[i][j].group)
            }
        }
    }

    getMaxGroup() {
        let maxGroup = 0
        for (let i = 0; i < this.groups.length; i++) {
            if (this.groups[i].count > maxGroup) maxGroup = this.groups[i].count
        }

        return maxGroup
    }

    bombBonus(tile, bombGroup) {
        if (!bombGroup) bombGroup = new TileGroup()
        tile.setGroup(bombGroup)

        for (let i = 0; i <= this.bombRadius; i++) {
            for (let j = 0; j <= this.bombRadius; j++) {
                if (tile.i - i >= 0) bombGroup.addTileWithoutGroup(this.field[tile.i-i][tile.j])
                if (tile.i + i < this.fieldCols) bombGroup.addTileWithoutGroup(this.field[tile.i+i][tile.j])
                if (tile.j - j >= 0) bombGroup.addTileWithoutGroup(this.field[tile.i][tile.j-j])
                if (tile.j + j < this.fieldRows) bombGroup.addTileWithoutGroup(this.field[tile.i][tile.j+j])
                if (tile.i - i >= 0 && tile.j - j >= 0) bombGroup.addTileWithoutGroup(this.field[tile.i-i][tile.j-j])
                if (tile.i + i < this.fieldCols && tile.j + j < this.fieldRows) bombGroup.addTileWithoutGroup(this.field[tile.i+i][tile.j+j])
                if (tile.i - i >= 0 && tile.j + j < this.fieldRows) bombGroup.addTileWithoutGroup(this.field[tile.i-i][tile.j+j])
                if (tile.i + i < this.fieldCols && tile.j - j >= 0) bombGroup.addTileWithoutGroup(this.field[tile.i+i][tile.j-j])
            }
        }

        for (let k = 0; k < bombGroup.count; k++) {
            const groupTile = bombGroup.tiles[k]
            if (groupTile.type === 'bomb' && groupTile.group !== bombGroup && tile !== groupTile) {
                bombGroup.mergeGroups(this.bombBonus(groupTile, bombGroup).group)
            }
        }

        return tile
    }

    setBomb(i, j) {
        const bomb = new Tile(i, j, 'bomb', new TileGroup())
        this.field[i][j] = bomb
        return bomb
    }
}