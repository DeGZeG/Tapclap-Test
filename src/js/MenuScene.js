import Phaser from 'phaser'
import MenuButton from "./MenuButton";

let Texts = {
    Title: 'Tapclap Test Game',
    Start: 'Начать игру',
    Options: 'Настройки'
}

let Styles = {
    Color: '#002f80',
    ButtonTextColor: '#FFFFFF',
    Font: 'Marvin'
}

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        this.load.image('blueTile', '../img/blue.png')
        this.load.image('greenTile', '../img/green.png')
        this.load.image('purpleTile', '../img/purple.png')
        this.load.image('redTile', '../img/red.png')
        this.load.image('yellowTile', '../img/yellow.png')
        this.load.image('bombTile', '../img/bomb.png')

        this.load.image('field', '../img/field.png')
        this.load.image('bonus', '../img/bonus.png')
        this.load.image('button', '../img/button.png')
        this.load.image('button2', '../img/button2.png')
        this.load.image('pause', '../img/pause.png')
        this.load.image('scorePanel', '../img/scorePanel.png')
    }

    create() {
        let titleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 300,
            Texts.Title,
            {font: `52px ${Styles.Font}`, fill: Styles.Color}
        )
        .setOrigin(0.5);

        let gameButton = new MenuButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY - 20,
            Texts.Start,
            {font: `26px ${Styles.Font}`, fill: Styles.ButtonTextColor},
            true
        )
        .on('pointerdown', () => {
            this.scene.start('Game')
        })

        let optionsButton = new MenuButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            Texts.Options,
            {font: `26px ${Styles.Font}`, fill: Styles.ButtonTextColor},
            true
        )
        .on('pointerdown', () => {
            this.scene.start('Options')
        })
    }
}