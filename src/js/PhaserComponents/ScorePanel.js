import Phaser from "phaser";

export default class ScorePanel extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, turnsCount) {
        super(scene, x, y, texture);

        this.setOrigin(0, 0).setScale(0.3)

        this.scoreText = new Phaser.GameObjects.Text(
            scene,
            this.getBottomCenter().x,
            this.getBottomCenter().y - 85,
            'Очки:\n0',
            {font: '32px Marvin', fill: '#FFFFFF', align: 'center'}
        ).setOrigin(0.5)

        this.turnsText = new Phaser.GameObjects.Text(
            scene,
            this.getTopCenter().x,
            this.getTopCenter().y + 20,
            'Ходов осталось:',
            {font: '16px Marvin', fill: '#FFFFFF', align: 'center'}
        ).setOrigin(0.5)

        this.turnsCountText = new Phaser.GameObjects.Text(
            scene,
            this.getBottomCenter().x,
            this.getBottomCenter().y - 225,
            turnsCount,
            {font: '70px Marvin', fill: '#FFFFFF', align: 'center'}
        ).setOrigin(0.5)

        scene.add.existing(this)
        scene.add.existing(this.scoreText)
        scene.add.existing(this.turnsText)
        scene.add.existing(this.turnsCountText)
    }

    setTurnsCount(turnsCount) {
        this.turnsCountText.setText(turnsCount)
    }

    setScore(score) {
        this.scoreText.setText(`Очки:\n${score}`)
    }
}
