import Phaser from 'phaser'
import MenuButton from "../PhaserComponents/MenuButton";
import Option from "../PhaserComponents/Option";

export default class OptionsScene extends Phaser.Scene {
    constructor() {
        super('Options');
    }

    create() {
        const x = this.cameras.main.centerX, y = this.cameras.main.centerY
        const optionsStyle = {font: '26px Marvin', fill: '#002f80'}

        const titleText = this.add.text(
            x, y - 300,
            'Настройки',
            {font: '52px Marvin', fill: '#002f80'}
        ).setOrigin(0.5);

        const turnsCount = new Option(
            this, x, y - 200,
            'Количество ходов:',
            optionsStyle,
            this.gameSettings,
            'turnsCount',
            1,
            {min: 15, max: 20}
        )

        const pointsToWin = new Option(
            this, x, y - 150,
            'Количество очков для победы',
            optionsStyle,
            this.gameSettings,
            'pointsToWin',
            10,
            {min: 10}
        )

        const fieldRows = new Option(
            this, x, y - 100,
            'Количество строк:',
            optionsStyle,
            this.gameSettings,
            'fieldRows',
            1,
            {min: 3, max: 9}
        )

        const fieldCols = new Option(
            this, x, y - 50,
            'Количество столбцов:',
            optionsStyle,
            this.gameSettings,
            'fieldCols',
            1,
            {min: 3, max: 9}
        )

        const colorsCount = new Option(
            this, x, y,
            'Количество цветов:',
            optionsStyle,
            this.gameSettings,
            'colorsCount',
            1,
            {min: 1, max: 5}
        )

        const minGroup = new Option(
            this, x, y + 50,
            'Минимальная группа для сжигания:',
            optionsStyle,
            this.gameSettings,
            'minGroup',
            1,
            {min: 1, max: 5}
        )

        const shuffleCount = new Option(
            this, x, y + 100,
            'Количество перемешиваний:',
            optionsStyle,
            this.gameSettings,
            'shuffleCount',
            1,
            {min: 0}
        )

        const bombRadius = new Option(
            this, x, y + 150,
            'Радиус бомбы:',
            optionsStyle,
            this.gameSettings,
            'bombRadius',
            1,
            {min: 1, max: 2}
        )

        const bombCount = new Option(
            this, x, y + 200,
            'Количество бонусных бомб:',
            optionsStyle,
            this.gameSettings,
            'bombCount',
            1,
            {min: 0}
        )

        const bombGroup = new Option(
            this, x, y + 250,
            'Минимальная группа для появления бомбы:',
            optionsStyle,
            this.gameSettings,
            'bombGroup',
            1,
            {min: 1}
        )

        const menuButton = new MenuButton(
            this, x, y + 350,
            'В меню',
            {font: '26px Marvin', fill: '#FFFFFF'},
            true
        )
        .on('pointerdown', () => {
            this.scene.start('Menu')
        })
    }
}