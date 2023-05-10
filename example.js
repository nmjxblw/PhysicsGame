class MyScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MyScene' });
    }
  
    create() {
      // 创建一个新的精灵对象
      this.player = this.physics.add.sprite(100, 100, 'player');
  
      // 设置精灵对象的速度和角度
      this.speed = 200;
      this.angle = 0;
  
      // 注册更新事件
      this.time.addEvent({
        delay: 10, // 更新间隔
        loop: true, // 循环更新
        callback: this.update, // 更新函数
        callbackScope: this, // 更新函数作用域
      });
    }
  
    update() {
      // 计算目标角度
      const targetAngle = this.time.now / 1000 * Math.PI * 2;
  
      // 计算速度向量
      const velocityX = this.speed * Math.cos(targetAngle);
      const velocityY = this.speed * Math.sin(targetAngle);
  
      // 设置精灵对象的速度和角度
      this.player.setVelocity(velocityX, velocityY);
      this.player.rotation = Phaser.Math.Angle.Between(0, 0, velocityX, velocityY);
    }
  }
  