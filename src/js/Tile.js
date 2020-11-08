export default class Tile {
    constructor(i, j, type, group) {
        this.i = i
        this.j = j
        this.type = type
        this.group = group
        group.addTile(this)
    }

    switchColor(newColor) {
        this.color = newColor
    }

    changeGroupFromTile(tile) {
        tile.group.addTile(this)
    }

    setGroup(group) {
        this.group = group
    }
}