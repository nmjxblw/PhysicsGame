class GameSceneExmaple extends PhysicGameScene {
    constructor() {
        super("Example1");
    }
}

class LogoScene extends Phaser.Scene{

    constructor(){
        super("logo");
    }

    preload() {
        this.load.path = './assets/';
        this.load.image("gamemaker", "gamemaker.png");
        this.load.audio('meow', 'funny-meow-110120.mp3');
    }

    create() {

        const centerX = this.game.config.width / 2;
        const centerY = this.game.config.height / 2;
        var rotateAngle = 0;

        this.cameras.main.fadeIn(1000, 255, 255, 255);

        let timer = this.time.addEvent({
            delay: 80,
            callback: createCircle,
            callbackScope: this,
            loop: true
        });

        function createCircle() {
            let color = Phaser.Display.Color.RandomRGB(50, 255);

            rotateAngle += 0.23;

            let circle = this.add.circle(centerX + 150 * Math.cos(rotateAngle), centerY + 150 * Math.sin(rotateAngle), 13, color.color);

            this.tweens.add({
                targets: circle,
                alpha: 0,
                scale: 2.2,
                duration: 2500,
                onComplete: function () {
                    circle.destroy();
                }
            });
        }

        var logoImage = this.add.image(
            centerX,
            centerY,
            'gamemaker'
        )
        logoImage.setScale(0.1);
        logoImage.alpha = 0;

        this.tweens.add({
            targets: logoImage,
            alpha: 1,
            scaleX: 0.4,
            scaleY: 0.4,
            angle: -10,
            duration: 1000,
            ease: "liner"
        });

        const logoBgm = this.sound.add('meow', { loop: false });

        logoBgm.play();

        this.input.on('pointerdown', () => {
            this.time.delayedCall(1000, () => {
                this.cameras.main.fadeOut(1000, 255, 255, 255);
                this.time.delayedCall(2000, () => {
                    this.scene.start('Menu');
                });
            });
        });
    }
}


var text1;

class Menu extends PhysicGameScene {

    constructor() {
        super("Menu", "Menu")
    }

    onEnter() {
         text1 = this.add.text(this.w / 2,
            this.h / 2,
            "📺 This is the center.")
            .setColor("#fff000")
            .setFontSize(50)
            .setOrigin(0.5)
            .setPosition(this.cx, this.cy);
    }

    update() {
        text1.setText("X: " + this.pointerX.toFixed(2) + " Y: " + this.pointerY.toFixed(2));
    }
}
const game = new Phaser.Game({
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [LogoScene,Menu],
    backgroundColor: 0x000000,
    title: "Physic Game",
});

game.globals = {
    TestVar: 100,

};