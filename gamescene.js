class gameScene1 extends PhysicGameScene{
    constructor(){
        super("Scene1");
    }
}

class Menu extends PhysicGameScene {

    constructor() {
        super("Menu", "Menu")
    }

    create() {
        this.add.text(this.w / 2, this.h / 2, "📺 This is the center.")
            .setColor("#fff")
            .setFontSize(13);

        this.input.on("pointermove", (pointer) => {
            console.log("centerX:" + this.w / 2);
            console.log("centerY:" + this.h / 2);
            console.log("x:" + pointer.x);
            console.log("y:" + pointer.y);
            if ((pointer.x <= this.w / 2 + 50
                && pointer.x >= this.w / 2 - 50)
                && (pointer.y <= this.h / 2 + 50
                    && pointer.y >= this.h / 2 - 50)) {
                console.log("In the center!");
            }
        });
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
    title: "Physic Game"
});