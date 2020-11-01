export default class Tile {
    constructor(i, j, color, group) {
        this.i = i
        this.j = j
        this.color = color
        this.group = group
        group.addTile(this)
    }

    switchColor(newColor) {
        this.color = newColor
    }

    changeGroupFromTile(tile) {
        tile.group.addTile(this)
    }
}