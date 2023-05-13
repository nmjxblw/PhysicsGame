class LogoScene extends Phaser.Scene {

    constructor() {
        super("logo");
    }

    preload() {
        this.load.path = './assets/';
        this.load.image("gamemaker", "gamemaker.png");
        this.load.audio('meow', 'funny-meow-110120.mp3');
    }

    create() {

        this.input.on

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

        this.jumpFunction();

        this.input.on('pointerdown', () => {
            this.time.delayedCall(1000, () => {
                this.cameras.main.fadeOut(1000, 255, 255, 255);
                this.time.delayedCall(2000, () => {
                    this.scene.start('Menu');
                });
            });
        });


    }

    jumpFunction() {
        this.input.keyboard.on('keydown', (event) => {
            console.log('keydown event', event);
            this.scene.start(`level${event.key}`);
        });
    }
}


var text1;

class Menu extends PhysicGameScene {

    constructor() {
        super("Menu", "Menu", false, false)
    }

    onEnter() {

        let GameTitle = this.add.text(
            this.w / 2,
            this.h / 2 - 200,
            "Doge!",
            { fontFamily: 'Comic Sans MS', }
        )
            .setColor("#2D719B")
            .setFontSize(100)
            .setOrigin(0.5)
            .setShadow(2, 2, '#333333', 2, false, true);

        text1 = this.add.text(this.w / 2,
            this.h / 2,
            "📺 This is the center.")
            .setColor("#fff000")
            .setFontSize(50)
            .setOrigin(0.5)
            .setPosition(this.cx, this.cy)
            .setAlpha(0);

        let StartText = this.add.text(
            0,
            0,
            "Start")
            .setOrigin(0.5)
            .setFontSize(50)
            .setAlpha(0.8)
            .setPosition(
                this.cx,
                this.cy + 200,
            )
            .setInteractive()
            .on("pointerover", () => {
                StartText.setAlpha(1).setColor('#fff000').setScale(1.1);
            })
            .on("pointerout", () => {
                StartText.setAlpha(0.8).setColor('#fff').setScale(1);
            })
            .on("pointerdown", () => {
                this.gotoScene("level1");
            });

        let CreditText = this.add.text(
            0,
            0,
            "Credit")
            .setOrigin(0.5)
            .setFontSize(50)
            .setAlpha(0.8)
            .setPosition(
                this.cx,
                this.cy + 300,
            )
            .setInteractive()
            .on("pointerover", () => {
                CreditText.setAlpha(1).setColor('#fff000').setScale(1.1);
            })
            .on("pointerout", () => {
                CreditText.setAlpha(0.8).setColor('#fff').setScale(1);
            })
            .on("pointerdown", () => {
                this.gotoScene("credit");
            });
    }

    OtherSceneUpdate() {
        //console.log("Now loading SceneUpdate()");
        text1.setText('X:' + this.pointerX.toFixed(2) + ' Y:' + this.pointerY.toFixed(2));//for debug
    }
}

class Level1Scene extends PhysicGameScene {

    constructor() {
        super("level1", 'Level 1', true, false);
    }

    onEnter() {
        let tips = this.add.text(
            this.cx,
            this.cy - 400,
            "Defense blue balls to do damage to enemy.",
            { fontFamily: 'Century Gothic', }
        )
            .setOrigin(0.5)
            .setAlpha(0.5)
            .setFontSize(50)
            .setColor('#2D719B');

        this.time.delayedCall(10000, () => {
            console.log("call");
            this.tweens.add({
                targets: tips,
                delay: 2000,
                alpha: 0,
                ease: "linear",
            });
        });
    }

    BattleSceneUpdate() {
    }
}

class Level2Scene extends PhysicGameScene {

    constructor() {
        super("level2", 'Level 2', true, false);
    }

    onEnter() {
    }

    BattleSceneUpdate() {
    }
}

class Level3Scene extends PhysicGameScene {

    constructor() {
        super("level3", 'Level 3', true, false);
    }

    onEnter() {
    }

    BattleSceneUpdate() {
    }
}

class Summary1 extends PhysicGameScene {
    constructor() {
        super("summary1", "Summary 1", false, true);
    }

    onEnter() {
    }

    SummarySceneUpdate() {

    }
}

class Summary2 extends PhysicGameScene {
    constructor() {
        super("summary2", "Summary 2", false, true);
    }

    onEnter() {
    }

    SummarySceneUpdate() {

    }
}

class Summary3 extends PhysicGameScene {
    constructor() {
        super("summary3", "Summary 3", false, true);
    }

    onEnter() {
    }

    SummarySceneUpdate() {

    }
}

class Credit extends PhysicGameScene {
    constructor() {
        super('credit', 'Credit', false, false);
    }

    onEnter() {
        this.loadTitle();

        let backText = this.add.text(
            200,
            50,
            "Back to Menu",
            { fontFamily: 'Century Gothic', }
        )
            .setOrigin(0.5)
            .setAlpha(0.8)
            .setFontSize(50)
            .setColor('#fff')
            .setInteractive()
            .on("pointerover", () => {
                backText.setScale(1.1).setAlpha(1);
            })
            .on('pointerout', () => {
                backText.setScale(1).setAlpha(0.8);
            })
            .on('pointerdown', () => {
                this.gotoScene('Menu');
            })
            ;

        let ArtCredit = this.add.text(
            this.cx,
            this.cy - 400,
            'Art',
            {
                fontFamily: 'Comic Sans MS',
            })
            .setOrigin(0.5)
            .setFontSize(80)
            .setColor('#fff')
            .setInteractive()
            .on("pointerover", () => {
                ArtCredit.setScale(1.1);
            })
            .on('pointerout', () => {
                ArtCredit.setScale(1);
            })
            ;

        let ArtCreditText = this.add.text(
            this.cx,
            this.cy - 300,
            'All arts are made by myself via Aseprite.',
            {
                fontFamily: 'Comic Sans MS',
            })
            .setOrigin(0.5)
            .setFontSize(50)
            .setColor('#fff')
            .setInteractive()
            ;

        let SoundCredit = this.add.text(
            this.cx,
            this.cy - 100,
            'Sound',
            {
                fontFamily: 'Comic Sans MS',
            })
            .setOrigin(0.5)
            .setFontSize(80)
            .setColor('#fff')
            .setInteractive()
            .on("pointerover", () => {
                SoundCredit.setScale(1.1);
            })
            .on('pointerout', () => {
                SoundCredit.setScale(1);
            })
            ;

        let SoundCreditText = this.add.text(
            this.cx,
            this.cy + 100,
            'funny-meow-110120.mp3\n-upload by u 8zlmcos31y\n-from:https://pixabay.com/zh/sound-effects/funny-meow-110120/',
            {
                fontFamily: 'Comic Sans MS',
            })
            .setOrigin(0.5, 0.5)
            .setFontSize(50)
            .setColor('#fff')
            .setInteractive()
            ;

    }

    OtherSceneUpdate() {

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
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: [LogoScene, Menu, Level1Scene, Summary1, Level2Scene, Summary2, Level3Scene, Summary3, Credit],
    backgroundColor: 0x000000,
    title: "Physic Game",
});

game.globals = {
    TestVar: 100,//console.log(this.game.globals.TestVar);//调用全局值
    Score: 0,
    Timer: 0,

    GameOver: false,
};