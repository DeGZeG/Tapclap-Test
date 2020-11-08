import Phaser from "phaser";
import MenuButton from "./MenuButton";

export default class Option extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style, settings, property, step, range) {
        super(scene, x, y, text, style);

        this.setOrigin(0.5).setInteractive().setText(`${text} ${settings[property]}`)

        this.minus = new MenuButton(
            scene,
            this.getRightCenter().x + 20,
            this.getRightCenter().y,
            '-',
            {font: '28px Marvin', fill: '#002f80'}
        )
        .setInteractive()
        .on('pointerdown', () => {
            if (!isNaN(range.min)) {
                if (settings[property] > range.min) {
                    settings[property] -= step
                    this.setText(`${text} ${settings[property]}`)
                }
            }
            else {
                settings[property] -= step
                this.setText(`${text} ${settings[property]}`)
            }
        })

        this.plus = new MenuButton(
            scene,
            this.getRightCenter().x + 40,
            this.getRightCenter().y,
            '+',
            {font: '28px Marvin', fill: '#002f80'}
        )
        .setInteractive()
        .on('pointerdown', () => {
            if (!isNaN(range.max)) {
                if (settings[property] < range.max) {
                    settings[property] += step
                    this.setText(`${text} ${settings[property]}`)
                }
            }
            else {
                settings[property] += step
                this.setText(`${text} ${settings[property]}`)
            }
        })

        scene.add.existing(this)
    }
}