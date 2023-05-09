class GameSceneExmaple extends PhysicGameScene {
    constructor() {
        super("Example1");
    }
}

var text1;
var mouseX = 0;
var mouseY = 0;

class Menu extends PhysicGameScene {

    constructor() {
        super("Menu", "Menu")
    }

    create() {
        text1 = this.add.text(this.game.config.width / 2,
            this.game.config.height / 2,
            "📺 This is the center.")
            .setColor("#fff")
            .setFontSize(50)
            .setOrigin(0.5)
            .setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

        let FullScreenText = this.add.text(0, 0, "Full Screen")
            .setFontSize(30)
            .setOrigin(0.5)
            .setPosition(1800, 1050)
            .setAlpha(0.1)
            .setInteractive()
            .on("pointerdown", () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                } else {
                    this.scale.startFullscreen();
                }
            })
            .on("pointerover",()=>{
                FullScreenText.setAlpha(1);
            })
            .on("pointerout",()=>{
                FullScreenText.setAlpha(0.1);
            });

        this.input.on("pointermove", (pointer) => {
            console.log("centerX:" + this.game.config.width / 2);
            console.log("centerY:" + this.game.config.height / 2);
            console.log("x:" + pointer.x);
            console.log("y:" + pointer.y);
            console.log(this.game.globals.key);
            mouseX = pointer.x;
            mouseY = pointer.y;
            if ((pointer.x <= this.game.config.width / 2 + 50
                && pointer.x >= this.game.config.width / 2 - 50)
                && (pointer.y <= this.game.config.height / 2 + 50
                    && pointer.y >= this.game.config.height / 2 - 50)) {
                console.log("In the center!");
            }
        });
    }

    update() {
        text1.setText("X: " + mouseX.toFixed(2) + " Y: " + mouseY.toFixed(2));
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
    scene: [Menu],
    backgroundColor: 0x000000,
    title: "Physic Game",
});

game.globals = {
    key: 100,
    w: game.config.width,
};