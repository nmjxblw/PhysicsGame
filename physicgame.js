class PhysicGameScene extends Phaser.Scene {
    init() { }

    constructor(key, name) {
        super(key);
        this.name = name;
    }

    create() {
        this.transitionDuration = 1000;

        this.cameras.main.fadeIn(this.transitionDuration, 0, 0, 0);

        this.w = this.game.config.width;
        this.h = this.game.config.height;

        this.cx = this.cameras.main.centerX;
        this.cy = this.cameras.main.centerY;

        this.pointerX = 0;
        this.pointerY = 0;

        this.add.rectangle(this.w / 2, 10, this.w, 20).setFillStyle(0Xffffff);

        let FullScreenText = this.add.text(0, 0, "Full Screen")
            .setColor(0xff0000)
            .setFontSize(30)
            .setOrigin(0.5)
            .setPosition(100, 10)
            .setAlpha(0.5)
            .setInteractive()
            .on("pointerdown", () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                    FullScreenText.setText("Full Screen").setPosition(100, 10);
                } else {
                    this.scale.startFullscreen();
                    FullScreenText.setText("Quit FullScreen").setPosition(140, 10);
                }
            })
            .on("pointerover", () => {
                FullScreenText.setAlpha(1);
            })
            .on("pointerout", () => {
                FullScreenText.setAlpha(0.5);
            });

            let QuitText = this.add.text(0, 0, "Quit Game")
            .setColor(0xff0000)
            .setFontSize(30)
            .setOrigin(0.5)
            .setPosition(this.w-100, 10)
            .setAlpha(0.5)
            .setInteractive()
            .on("pointerdown", () => {
                window.close();
            })
            .on("pointerover", () => {
                QuitText.setAlpha(1);
            })
            .on("pointerout", () => {
                QuitText.setAlpha(0.5);
            });

        this.input.on("pointermove", (pointer) => {
            //console.log("centerX:" + this.game.config.width / 2);
            //console.log("centerY:" + this.game.config.height / 2);
            /* console.log("x:" + pointer.x);
            console.log("y:" + pointer.y); */
            //console.log(this.game.globals.TestVar);//调用全局值
            this.pointerX = pointer.x;
            this.pointerY = pointer.y;
            /* if ((pointer.x <= this.game.config.width / 2 + 50
                && pointer.x >= this.game.config.width / 2 - 50)
                && (pointer.y <= this.game.config.height / 2 + 50
                    && pointer.y >= this.game.config.height / 2 - 50)) {
                console.log("In the center!");
            } */
        });

        this.onEnter();
    }

    gotoScene(key) {
        console.log(key);
        this.cameras.main.fade(this.transitionDuration, 0, 0, 0);
        this.time.delayedCall(this.transitionDuration, () => {
            this.scene.start(key);
        });
    }

    onEnter() {
        console.warn('This AdventureScene did not implement onEnter():', this.constructor.name);
    }
}