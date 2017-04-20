var SpaceHipster = SpaceHipster || {};

SpaceHipster.Enemy = function(game, x, y, key, health, enemyBullets, shootHz){
    Phaser.Sprite.call(this, game, x, y, key);
    this.shootHz = SpaceHipster.GameState.rnd;
    this.game = game;
    //redundant enable physics
    //this.game.physics.arcade.enable(this);
    
    this.animations.add('getHit', [0,1,2,1,0], 25, false);
    this.anchor.setTo(0.5);
    this.health = health;
    
    
    this.enemyBullets = enemyBullets;
    
    this.enemyTimer = this.game.time.create(false);
    this.enemyTimer.start();
    
    this.scheduleShooting();
};
   


SpaceHipster.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
SpaceHipster.Enemy.prototype.constructor = SpaceHipster.Enemy;

SpaceHipster.Enemy.prototype.update = function(){
    
    if(this.x <0.05 * this.game.world.width){
        this.x = 0.05 * this.game.world.width +2;
        this.body.velocity.x *= -1;
    }
    else if (this.x > 0.95 * this.game.world.width){
        this.x = 0.95 * this.game.world.width - 2;
        this.body.velocity.x *= -1;
    }

    if(this.top > this.game.world.height) {
        this.kill();
        this.enemyTimer.pause();
        console.log(SpaceHipster.GameState.missedEnemyCounter);
        SpaceHipster.GameState.playerHealth -= 1;
        console.log(SpaceHipster.GameState.missedEnemyCounter);
        SpaceHipster.GameState.resetPlayer();
        SpaceHipster.GameState.resetEnemies();
        this.y = -100;
        if(SpaceHipster.GameState.playerHealth <= 0){
            SpaceHipster.GameState.killPlayer();
        }
    }
        
        
};

SpaceHipster.Enemy.prototype.removeEnemy = function(){
    SpaceHipster.Enemy.prototype.removeEnemy.call(this);
    this.kill();
    this.enemyTimer.pause();
};

SpaceHipster.Enemy.prototype.damage = function(amount){
  Phaser.Sprite.prototype.damage.call(this, amount);
  console.log(this.health);
  this.play('getHit');
  if(this.health <= 0){
      
      var emitter = this.game.add.emitter(this.x, this.y, 100);
      emitter.makeParticles('enemyParticle');
      emitter.minParticleSpeed.setTo(-200, -200);
      emitter.maxParticleSpeed.setTo(200, 200);
      emitter.gravity = 0;
      emitter.start(true, 500, null, 100);
      
      this.enemyTimer.pause();
  }
  
};

SpaceHipster.Enemy.prototype.pauseTimer = function(){
    this.enemyTimer.pause();
};

SpaceHipster.Enemy.prototype.resumeTimer = function(){
    this.enemyTimer.resume();
};

SpaceHipster.Enemy.prototype.scheduleShooting = function(){
    this.shoot();
    //console.log(this.shootHz);
    this.enemyTimer.add(Phaser.Timer.SECOND / this.shootHz * 4, this.scheduleShooting, this);
};

SpaceHipster.Enemy.prototype.shoot = function() {
  var bullet = this.enemyBullets.getFirstExists(false);
  
  if(!bullet){
      bullet = new SpaceHipster.EnemyBullet(this.game, this.x, this.bottom);
      this.enemyBullets.add(bullet);
  }else {
      bullet.reset(this.x, this.y);
  }
  bullet.body.velocity.y = 100;
  
};

/*
SpaceHipster.Enemy.prototype.hitAnimation = function(){
    this.animations.play('getHit');
};

SpaceHipster.Enemy.prototype.initBullets = function(){
    this.enemyBullets = this.add.group();
    this.enemyBullets.enableBody = true;
};

SpaceHipster.Enemy.prototype.createEnemyBullet = function(){
    var bullet = this.enemyBullets.getFirstExists(false);
    
    if(!bullet) {
      bullet = new SpaceHipster.PlayerBullet(this.game, this.Enemy.x, this.Enemy.bottom);
      this.enemyBullets.add(bullet);
    }else{
      bullet.reset(this.Enemy.x, this.Enemy.bottom);
    }
    bullet.body.velocity.y = this.BULLET_SPEED * -1;
};
*/
