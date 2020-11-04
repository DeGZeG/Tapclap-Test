import Phaser from 'phaser'
import MenuButton from "./MenuButton";
import Option from "./Option";

let Texts = {
    Title: 'Настройки',
    TurnsCount: 'Количество ходов:',
    PointsToWin: 'Количество очков для победы',
    FieldRows: 'Количество столбцов:',
    FieldCols: 'Количество строк:',
    ColorsCount: 'Количество цветов:',
    MinGroup: 'Минимальная группа для сжигания:',
    ShuffleCount: 'Количество перемешиваний:',
    BombRadius: 'Радиус бомбы:',
    BombCount: 'Количество бонусных бомб:',
    BombGroup: 'Минимальная группа для появления бомбы:',
    Menu: 'В меню',
}

let Styles = {
    Color: '#002f80',
    WhiteColor: '#FFFFFF',
    Font: 'Marvin'
}

export default class OptionsScene extends Phaser.Scene {
    constructor() {
        super('Options');
    }

    create() {
        let titleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 300,
            Texts.Title,
            {font: `52px ${Styles.Font}`, fill: Styles.Color}
        )
        .setOrigin(0.5);

        let turnsCount = new Option(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY - 200,
            Texts.TurnsCount,
            {font: `26px ${Styles.Font}`, fill: Styles.Color},
            this.gameSettings,
            'turnsCount',
            1,
            {min: 15, max: 20}
        )

        let pointsToWin = new Option(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY - 150,
            Texts.PointsToWin,
            {font: `26px ${Styles.Font}`, fill: Styles.Color},
            this.gameSettings,
            'pointsToWin',
            10,
            {min: 10}
        )

        let fieldRows = new Option(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            Texts.FieldRows,
            {font: `26px ${Styles.Font}`, fill: Styles.Color},
            this.gameSettings,
            'fieldRows',
            1,
            {min: 3, max: 9}
        )

        let fieldCols = new Option(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            Texts.FieldCols,
            {font: `26px ${Styles.Font}`, fill: Styles.Color},
            this.gameSettings,
            'fieldCols',
            1,
            {min: 3, max: 9}
        )

        let colorsCount = new Option(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            Texts.ColorsCount,
            {font: `26px ${Styles.Font}`, fill: Styles.Color},
            this.gameSettings,
            'colorsCount',
            1,
            {min: 1, max: 5}
        )

        let minGroup = new Option(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            Texts.MinGroup,
            {font: `26px ${Styles.Font}`, fill: Styles.Color},
            this.gameSettings,
            'minGroup',
            1,
            {min: 1, max: 5}
        )

        let shuffleCount = new Option(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            Texts.ShuffleCount,
            {font: `26px ${Styles.Font}`, fill: Styles.Color},
            this.gameSettings,
            'shuffleCount',
            1,
            {min: 0}
        )

        let bombRadius = new Option(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 150,
            Texts.BombRadius,
            {font: `26px ${Styles.Font}`, fill: Styles.Color},
            this.gameSettings,
            'bombRadius',
            1,
            {min: 1, max: 2}
        )

        let bombCount = new Option(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 200,
            Texts.BombCount,
            {font: `26px ${Styles.Font}`, fill: Styles.Color},
            this.gameSettings,
            'bombCount',
            1,
            {min: 0}
        )

        // let bombGroup = new Option(
        //     this,
        //     this.cameras.main.centerX,
        //     this.cameras.main.centerY + 250,
        //     Texts.BombGroup,
        //     {font: `26px ${Styles.Font}`, fill: Styles.Color},
        //     this.gameSettings,
        //     'bombGroup',
        //     1,
        //     {min: 0}
        // )

        let menuButton = new MenuButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 300,
            Texts.Menu,
            {font: `26px ${Styles.Font}`, fill: Styles.WhiteColor},
            true
        )
        .on('pointerdown', () => {
            this.scene.start('Menu')
        })
    }
}