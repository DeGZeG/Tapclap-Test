import Phaser from "phaser";

export default class MenuButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style, background = false) {
        super(scene, x, y, text, style);

        this.setInteractive()
            .setOrigin(0.5)
            .on('pointerover', () => {
                this.setStyle({fill: '#FF0000'})
            })
            .on('pointerout', () => {
                if (background) {
                    this.setStyle({fill: '#FFFFFF'})
                }
                else {
                    this.setStyle({fill: '#002f80'})
                }
            });

        scene.add.existing(this);

        if (background) {
            this.background = new Phaser.GameObjects.Image(scene, x, y, 'button2')
            this.background.setScale(0.4).setDepth(-1)

            scene.add.existing((this.background))
        }
    }
}