class PhysicGameScene extends Phaser.Scene {
    init() { }

    constructor(key, name) {
        super(key);
        this.name = name;
    }

    create() {
        this.w = this.game.config.width;
        this.h = this.game.config.height;
        console.log("centerX:" + this.w / 2);
        console.log("centerY:" + this.h / 2);
    }
}