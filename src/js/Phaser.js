import Phaser from 'phaser'
import MenuScene from "./MenuScene"
import OptionsScene from "./OptionsScene";
import GameScene from "./GameScene"

class GameSettings extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager);

        this.turnsCount = 20
        this.pointsToWin = 300
        this.fieldRows = 7
        this.fieldCols = 7
        this.colorsCount = 5
        this.minGroup = 2
        this.shuffleCount = 3
        this.bombRadius = 1
        this.bombCount = 3
        this.bombGroup = 5
    }
}

let phaser = new Phaser.Game({
    type: Phaser.AUTO,
    plugins: {
        global: [
            { key: 'GameSettings', plugin: GameSettings, start: false, mapping: 'gameSettings'}
        ]
    },
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#F0F0FF",
    scene: [MenuScene,  OptionsScene, GameScene]
})