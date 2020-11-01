export default class TileGroup {
    constructor(...tiles) {
        this.tiles = []
        this.count = 0
        tiles.map(tile => this.addTile(tile))
    }

    addTile(tile) {
        tile.group = this
        this.tiles.push(tile)
        this.count++
    }

    deleteTile(tile) {
        this.tiles = this.tiles.filter(tl => tl !== tile)
        this.count--
    }

    deleteGroup() {
        this.tiles.map(tile => {
            tile.group = null
            this.deleteTile(tile)
        })
    }

    mergeGroups(group) {
        if (this !== group) {
            for (let i = 0; i < group.count; i++) {
                this.addTile(group.tiles[i])
            }
        }
    }
}