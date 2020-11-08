import Phaser from "phaser";

export default class Bonus extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, bonusName, bonusCount) {
        super(scene, x, y, texture);

        this.isActive = false

        this.setScale(0.4).setInteractive()

        this.bonusName = new Phaser.GameObjects.Text(
            scene,
            this.getBottomCenter().x,
            this.getBottomCenter().y - 55,
            bonusName,
            {font: `15px Marvin`, fill: '#FFFFFF', align: 'center'}
        ).setOrigin(0.5)

        this.bonusCount = new Phaser.GameObjects.Text(
            scene,
            this.getBottomCenter().x,
            this.getBottomCenter().y - 120,
            bonusCount,
            {font: `40px Marvin`, fill: '#FFFFFF', align: 'center'}
        ).setOrigin(0.5)

        scene.add.existing(this)
        scene.add.existing(this.bonusName)
        scene.add.existing(this.bonusCount)
    }

    setCount(count) {
        this.bonusCount.setText(count)
    }

    toggleActive() {
        this.isActive = !this.isActive

        if (this.isActive) {
            this.bonusName.setStyle({fill: '#FF0000'})
        }
        else {
            this.bonusName.setStyle({fill: '#FFFFFF'})
        }
    }
}
