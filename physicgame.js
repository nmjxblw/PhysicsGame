//代码参考：https://labs.phaser.io/edit.html?src=src/physics/arcade/space%20battle.js
class PhysicGameScene extends Phaser.Scene {
    init() { }

    constructor(key, name, isBattleScene, isSummaryScene) {
        super(key);
        this.name = name;
        this.isBattleScene = isBattleScene;
        this.isSummaryScene = isSummaryScene;
        this.level = parseInt(this.name.replace(/[^0-9]/ig, ""));//提取name中的level
    }

    preload() {
        this.load.path = './assets/';
        this.load.image("player-stable", 'player-pixel.png');
        this.load.image("player-sheild", "player-sheild-pixel.png");
        this.load.image("enemy", 'enemy-pixel.png');
        this.load.image("bar", "bar.png");
        this.load.image("red-bullet", "red-bullet.png");
        this.load.image("blue-bullet", "blue-bullet.png");
        this.load.image("green-bullet", "green-bullet.png");
        this.load.image("heart", "heart-pixel.png");
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
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
        this.loadPointerPosition();//更新指针的位置

        this.graphics = this.add.graphics();

        //加载全屏和退出
        this.add.rectangle(this.w / 2, 10, this.w, 20).setFillStyle(0Xffffff);

        this.loadFullScreenText();

        this.loadQuitText();



        //检测场景类型并加载
        if (this.isBattleScene) {
            this.loadTitle();
            this.loadBattleScene();
        }
        else if (this.isSummaryScene) {
            this.loadTitle();
            this.loadSummaryScene();
        }


        this.onEnter();//拓展函数

    }

    //场景跳转函数并播放过场动画
    gotoScene(key) {
        console.log(key);
        this.cameras.main.fade(this.transitionDuration, 0, 0, 0);
        this.time.delayedCall(this.transitionDuration, () => {
            this.scene.start(key);
        });
    }


    //加载场景标题
    loadTitle() {
        this.sceneTitle = this.add.text(this.cx, 50, `${this.name}`, { fontFamily: 'Century Gothic', fontSize: 50, color: '#ffffff' })
            .setShadow(2, 2, '#333333', 2, false, true)
            .setOrigin(0.5);;
    }


    //加载全屏文本和互动功能
    loadFullScreenText() {
        this.FullScreenText = this.add.text(0, 0, "Full Screen")
            .setColor(0xff0000)
            .setFontSize(30)
            .setOrigin(0.5)
            .setPosition(100, 10)
            .setAlpha(0.5)
            .setInteractive()
            .on("pointerdown", () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                    this.FullScreenText.setText("Full Screen").setPosition(100, 10);
                } else {
                    this.scale.startFullscreen();
                    this.FullScreenText.setText("Quit FullScreen").setPosition(140, 10);
                }
            })
            .on("pointerover", () => {
                this.FullScreenText.setAlpha(1);
            })
            .on("pointerout", () => {
                this.FullScreenText.setAlpha(0.5);
            });

    }


    //加载退出文本和互动功能
    loadQuitText() {
        this.QuitText = this.add.text(0, 0, "Quit Game")
            .setColor(0xff0000)
            .setFontSize(30)
            .setOrigin(0.5)
            .setPosition(this.w - 100, 10)
            .setAlpha(0.5)
            .setInteractive()
            .on("pointerdown", () => {
                window.close();
            })
            .on("pointerover", () => {
                this.QuitText.setAlpha(1);
            })
            .on("pointerout", () => {
                this.QuitText.setAlpha(0.5);
            });
    }


    //更新指针坐标
    loadPointerPosition() {
        this.input.on("pointermove", (pointer) => {
            this.pointerX = pointer.x;
            this.pointerY = pointer.y;
        });
    }


    //加载战斗场景
    loadBattleScene() {

        console.log("this.level:" + this.level);
        this.player = this.physics.add.sprite(this.w * 0.1, this.h / 2, "player-stable")
            .setBodySize(40, 40)
            .setScale(2);
        this.enemy = this.physics.add.sprite(this.w * 0.9, this.h / 2, "enemy").setScale(2).refreshBody();
        this.enemyBullets = this.add.existing(
            new Bullets(this.physics.world, this, { name: 'red-bullets' })
        );

        this.enemyBullets.createMultiple({
            key: 'red-bullet',
            quantity: 5,
            setScale: {
                x: 0.5,
                y: 0.5
            }
        });

        this.enemyBullets.children.iterate(function (enemyBullet) {
            enemyBullet.setCircle(30);
        });

        this.trickBullets = this.add.existing(
            new Bullets(this.physics.world, this, { name: 'blue-bullets' })
        );

        this.trickBullets.createMultiple({
            key: 'blue-bullet',
            quantity: 5,
            setScale: {
                x: 0.5,
                y: 0.5
            }
        });

        this.trickBullets.children.iterate(function (trickBullet) {
            trickBullet.setCircle(30);
        });

        this.playerBullets = this.add.existing(
            new Bullets(this.physics.world, this, { name: 'green-bullets' })
        );

        this.playerBullets.createMultiple({
            key: 'green-bullet',
            quantity: 5,
            setScale: {
                x: 0.5,
                y: 0.5
            }
        });

        this.playerBullets.children.iterate(function (playerBullet) {
            playerBullet.setCircle(30);
        });

        this.platform = this.physics.add.group({
            defaultKey: 'bar'
        });

        this.physics.world.setBounds(10, 20, this.w - 10, this.h - 20);

        //调用碰撞函数
        this.physics.world.on('worldbounds', (body) => {
            body.gameObject.onWorldBounds();
        });

        this.player.hp = this.getPlayerHp(this.level);
        this.enemy.hp = this.getEnemyHp(this.level);

        //加载计时器
        this.loadTimer();

        //加载障碍物
        this.loadBarrier(this.level);

        //加载敌人开火逻辑
        this.loadEnemyFiring(this.level);

        //加载红心
        this.displayHeart();
        this.displayEnemyHeart();

        this.physics.add.overlap(this.player, this.enemyBullets, this.playerHit, null, this);
        this.physics.add.overlap(this.player, this.trickBullets, this.playerHit, null, this);
        this.physics.add.overlap(this.platform, this.enemyBullets, this.platformHit, null, this);
        this.physics.add.overlap(this.platform, this.trickBullets, this.platformHit, null, this);
        this.physics.add.overlap(this.enemy, this.playerBullets, this.enemyHit, null, this);
    }

    //显示红心
    getPlayerHp(level) {
        if (level == 1) { return 5; }
        else if (level == 2) { return 4; }
        else { return 3; }
    }

    getEnemyHp(level) {
        if (level == 1) { return 4; }
        else if (level == 2) { return 5; }
        else { return 6; }
    }

    displayHeart() {
        //console.log("heart display");
        this.hearts = [];
        for (let i = 0; i < this.player.hp; i++) {
            const heart = this.add.image(80 * i + 100, 50, 'heart');
            //console.log("Heart " + i + " display.");
            this.hearts.push(heart);
        }
    }

    displayEnemyHeart() {
        //console.log("heart display");
        this.EnemyHearts = [];
        for (let i = 0; i < this.enemy.hp; i++) {
            const enemyHeart = this.add.image(-80 * i + this.w - 100, 50, 'enemy');
            //console.log("Heart " + i + " display.");
            this.EnemyHearts.push(enemyHeart);
        }
    }

    //加载计时器,当进入这个场景时开始计时，离开后停止计时。
    loadTimer() {
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.scene.isActive()) {
                    this.game.globals.Timer++;
                    console.log(this.game.globals.Timer);
                }
            },
            callbackScope: this,
            loop: true,
        });

        this.game.globals.Timer = 0;
    }

    //加载敌人的开火逻辑，
    //根据不同等级改变发射逻辑
    loadEnemyFiring(level) {

        if (level == 1) {
            this.fireCount = 0;
            this.enemyFiring = this.time.addEvent({
                delay: 750,
                loop: true,
                callback: () => {

                    this.fireCount++;

                    // 每执行5次后暂停3秒，并重置计数器
                    if (this.fireCount % 3 === 0) {
                        //console.log("paused");
                        this.enemyFiring.paused = true;
                        this.time.addEvent({
                            delay: 3000,
                            callback: function () {
                                this.enemyFiring.paused = false;
                                this.fireCount = 0;
                            },
                            callbackScope: this
                        });
                    }
                    const rand = Phaser.Math.Between(1, 100);
                    //console.log(rand);
                    if (rand > 20) {
                        this.enemyBullets.fire(this.enemy.x - 50, this.enemy.y, -500, 0);
                    }
                    else {
                        this.trickBullets.fire(this.enemy.x - 50, this.enemy.y, -500, 0);
                    }
                }
            });
        }
        else if (level == 2) {

        }
        else {

        }
    }

    //当玩家被子弹击中时的逻辑
    playerHit(player, enemyBullte) {
        //debugger;
        //console.log(typeof enemyBullte);
        //console.log(enemyBullte.texture.key);
        enemyBullte.disableBody(true, true);
        if (this.player.def && enemyBullte.texture.key == "blue-bullet") {
            const angle = Phaser.Math.Angle.Between(this.player.x + 50, this.player.y, this.enemy.x, this.enemy.y);
            //console.log(angle);
            const velocityX = 500 * Math.cos(angle);
            const velocityY = 500 * Math.sin(angle);
            this.playerBullets.fire(this.player.x + 50, this.player.y, velocityX, velocityY)
        }
        else {
            player.hp -= 1;
            if (this.game.globals.Score > 0) { this.game.globals.Score--; }
        }
    }

    //当子弹击中障碍物的逻辑
    platformHit(platform, enemyBullte) {
        //debugger;
        enemyBullte.disableBody(true, true);
    }

    enemyHit(enemy, playerBullet) {
        playerBullet.disableBody(true, true);
        enemy.hp -= 1;
        this.game.globals.Score++;
    }

    //加载update()中玩家操作逻辑
    UpdatePlayer() {

        let player = this.player;

        if (player.y != this.pointerY) {
            if (this.pointerY <= this.h - 50 && this.pointerY >= 100) {
                player.setY(this.pointerY);
            }
        }

        if (this.input.activePointer.isDown) {
            player.setTexture("player-sheild");
            player.def = true;
        }
        else {
            player.setTexture("player-stable");
            player.def = false;
        }
    }

    UpdateCheckWin() {
        if (this.player.hp <= 0) {
            this.game.globals.GameOver = true;
            this.gotoScene(`summary${this.level}`);
            return;
        }
        else if (this.enemy.hp <= 0) {
            this.game.globals.GameOver = false;
            this.gotoScene(`summary${this.level}`);
            return;
        }
        else {
            this.game.globals.GameOver = false;
        }
    }

    //障碍物设置函数
    loadBarrier(level) {

        if (level == 1) {

            this.platform.create(this.w / 2 + 200, this.h / 6 + 20).setVelocityY(500).setBounce(1);

            for (const platformbar of this.platform.getChildren()) {
                platformbar.immovable = true;
                platformbar.setCollideWorldBounds(true);
            }

        }
        else if (level == 2) {

        }
        else {

        }
    }

    //Boss逻辑设置函数
    UpdateBoss(level) {

        let enemy = this.enemy;
        let player = this.player;


        //设置boss移动逻辑
        //当boss的y坐标与玩家坐标差绝对值大于25时移动
        var positionDiff = enemy.y - player.y;
        var BossMoveSpeed = 0;

        if (positionDiff > 25) {

            if (level == 1) {
                BossMoveSpeed = -2;
            }
            else {
                BossMoveSpeed = -10
            }

        }
        else if (positionDiff < -25) {

            if (level == 1) {
                BossMoveSpeed = 2;
            }
            else {
                BossMoveSpeed = 10
            }
        }
        enemy.y += BossMoveSpeed;
    }

    UpdateHeart() {
        for (let i = 0; i < this.hearts.length; i++) {
            if (i < this.player.hp) {
                this.hearts[i].setVisible(true);
            } else {
                this.hearts[i].setVisible(false);
            }
        }
        for (let i = 0; i < this.EnemyHearts.length; i++) {
            if (i < this.enemy.hp) {
                this.EnemyHearts[i].setVisible(true);
            } else {
                this.EnemyHearts[i].setVisible(false);
            }
        }
    }

    loadSummaryScene() {
        //显示时间
        if (this.game.globals.Score > Math.floor(this.game.globals.Timer / 10)) {
            this.game.globals.Score -= Math.floor(this.game.globals.Timer / 10);
        }
        this.add.text(this.cx, this.cy - 200, `Time Taken:${this.game.globals.Timer}s`)
            .setFontSize(80)
            .setOrigin(0.5);

        this.add.text(this.cx, this.cy - 300, `Your Score:${this.game.globals.Score}`)
            .setFontSize(80)
            .setOrigin(0.5);

        if (this.game.globals.GameOver) {
            this.add.text(this.cx, this.cy + 100, `You Failed!`)
            .setFontSize(80)
            .setOrigin(0.5);

            const AgainText = this.add.text(this.cx, this.cy + 200, `Again!`, { fontFamily: 'Comic Sans MS', })
            .setFontSize(50)
            .setOrigin(0.5)
            .setInteractive()
            .setAlpha(0.8)
            .on("pointerover",()=>{
                AgainText.setAlpha(1).setColor("#fff000");
            })
            .on("pointerout",()=>{
                AgainText.setAlpha(0.8).setColor("#fff");
            })
            .on("pointerdown",()=>{
                this.gotoScene('level1');
            });
        }
        else{
            this.add.text(this.cx, this.cy + 100, `Congratulations!`)
            .setFontSize(80)
            .setOrigin(0.5);

            const NextLevelText = this.add.text(this.cx, this.cy + 200, `Next level!`, { fontFamily: 'Comic Sans MS', })
            .setFontSize(50)
            .setOrigin(0.5)
            .setInteractive()
            .setAlpha(0.8)
            .on("pointerover",()=>{
                NextLevelText.setAlpha(1).setColor("#fff000");
            })
            .on("pointerout",()=>{
                NextLevelText.setAlpha(0.8).setColor("#fff");
            })
            .on("pointerdown",()=>{
                let nextlevel = this.level + 1;
                console.log(nextlevel);
                if(nextlevel <= 3){
                    this.gotoScene(`level${nextlevel}`);
                }
                else{
                    this.gotoScene(`credit`);
                }
            });
        }
    }


    //重载函数，当子类没有onEnter()函数时报错
    onEnter() {
        console.warn('This AdventureScene did not implement onEnter():', this.constructor.name);
    }

    //逐帧监听函数
    update() {
        if (this.isBattleScene) {
            this.UpdatePlayer();//加载玩家操作逻辑
            this.UpdateBoss(this.level);//加载boss的AI
            this.UpdateHeart();//加载红心
            this.UpdateCheckWin();
            this.BattleSceneUpdate();//加载战斗场景额外update()
        }
        else if (this.isSummaryScene) {
            this.SummarySceneUpdate();//加载总结场景额外update()
        }
        else {
            this.OtherSceneUpdate();//加载其他场景额外update()
        }
    }

    //重载函数，当子类没有BattleSceneUpdate()函数时报错
    BattleSceneUpdate() {
        console.warn('This PhysicGameScene did not implement BattleSceneUpdate():', this.constructor.name);
        return;
    }

    //重载函数，当子类没有SummarySceneUpdate()函数时报错
    SummarySceneUpdate() {
        console.warn('This PhysicGameScene did not implement SummarySceneUpdate():', this.constructor.name);
        return;
    }
    //重载函数，当子类没有OtherSceneUpdate()函数时报错
    OtherSceneUpdate() {
        console.warn('This PhysicGameScene did not implement OtherSceneUpdate():', this.constructor.name);
        return;
    }
}

//定义子弹类
//copy from phaser:https://labs.phaser.io/edit.html?src=src/physics/arcade/space%20battle.js
class Bullet extends Phaser.Physics.Arcade.Sprite {
    fire(x, y, vx, vy) {
        this.enableBody(true, x, y, true, true);
        /*在Phaser中，this.enableBody()是用于启用游戏对象的物理引擎支持的方法。该方法有五个可选参数，分别为：
                enable：一个布尔值，指定是否启用物理引擎支持。
                x：一个数值，指定游戏对象的初始x坐标。
                y：一个数值，指定游戏对象的初始y坐标。
                static：一个布尔值，指定游戏对象是否为静态的，即是否可以移动。默认值为false，即游戏对象可以移动。
                showBody：一个布尔值，指定是否在游戏对象上显示物理引擎支持的边框。默认值为false，即不显示边框。 */
        this.setVelocity(vx, vy);
    }

    onCreate() {
        this.disableBody(true, true);
        /* 在Phaser中，this.disableBody()是用于禁用游戏对象的物理引擎支持的方法。该方法有两个可选参数，分别为：
            disableGameObject：一个布尔值，指定是否同时禁用游戏对象本身。默认值为false，即不禁用游戏对象本身。
            hideGameObject：一个布尔值，指定是否同时隐藏游戏对象本身。默认值为false，即不隐藏游戏对象本身。 */
        this.body.collideWorldBounds = true;
        this.body.onWorldBounds = true;
    }

    onWorldBounds() {
        //在子弹出界时销毁
        //console.log("hit");
        this.disableBody(true, true);
    }
}

class Bullets extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, config) {
        super(
            world,
            scene,
            { ...config, classType: Bullet, createCallback: Bullets.prototype.onCreate }
        );
    }

    fire(x, y, vx, vy) {
        const bullet = this.getFirstDead(false);

        if (bullet) {
            bullet.fire(x, y, vx, vy);
        }
    }

    onCreate(bullet) {
        bullet.onCreate();
    }

    poolInfo() {
        return `${this.name} total=${this.getLength()} active=${this.countActive(true)} inactive=${this.countActive(false)}`;
    }
}