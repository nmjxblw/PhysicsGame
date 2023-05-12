//代码参考：https://labs.phaser.io/edit.html?src=src/physics/arcade/space%20battle.js
class PhysicGameScene extends Phaser.Scene {
    init() { }

    constructor(key, name, isBattleScene, isSummaryScene) {
        super(key);
        this.name = name;
        this.isBattleScene = isBattleScene;
        this.isSummaryScene = isSummaryScene;
        this.level = this.name.replace(/[^0-9]/ig, "");//提取name中的level
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

        this.platform = this.physics.add.group({
            defaultKey: 'bar'
        });

        this.physics.world.setBounds(10, 20, this.w - 10, this.h - 20);

        //调用碰撞函数
        this.physics.world.on('worldbounds', (body) => {
            body.gameObject.onWorldBounds();
        });

        this.loadTimer();
        this.loadBarrier(this.level);

        //加载敌人开火逻辑
        this.loadEnemyFiring(this.level);

        this.physics.add.overlap(this.player, this.enemyBullets, this.playerHit, null, this);
        this.physics.add.overlap(this.platform, this.enemyBullets, this.platformHit, null, this);
    }

    //加载计时器,当进入这个场景时开始计时，离开后停止计时。
    loadTimer() {
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.scene.isActive()) {
                    this.scene.timeCount++;
                }
            },
            callbackScope: this,
            loop: true,
        });

        this.timeCount = 0;
    }

    //加载敌人的开火逻辑，
    //根据不同等级改变发射逻辑
    loadEnemyFiring(level) {
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

                    this.enemyBullets.fire(this.enemy.x - 50, this.enemy.y, -500, 0)
                }
            });
        }
        else if (level == 2) {

        }
        else {

        }
    }

    //当玩家被子弹击中时的逻辑
    playerHit(plyaer, enemyBullte) {
        //debugger;
        enemyBullte.disableBody(true, true);
    }

    //当子弹击中障碍物的逻辑
    playerHit(platform, enemyBullte) {
        //debugger;
        enemyBullte.disableBody(true, true);
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

    //障碍物设置函数
    loadBarrier(level) {

        if (level == 1) {

            this.platform.create(this.w / 2 + 200, this.h / 6 + 10);

            for (const platformbar of this.platform.getChildren()) {
                platformbar.immovable = true;
                platformbar.setVelocityY = 200;
            }

            /* this.time.addEvent({
                delay: 1500,
                loop: true,
                callback: function () {
                    for (this.platformbar of platform.getChildren()) {
                        this.platformbar.body.velocity.y *= -1;
                    }
                }
            }); */

            //this.physics.add.overlap(platform, this.enemyBullets, this.platformHit, null, this);
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


    //重载函数，当子类没有onEnter()函数时报错
    onEnter() {
        console.warn('This AdventureScene did not implement onEnter():', this.constructor.name);
    }

    //逐帧监听函数
    update() {
        if (this.isBattleScene) {
            this.UpdatePlayer();//加载玩家操作逻辑
            this.UpdateBoss(this.level);//加载boss的AI
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