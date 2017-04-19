var SpaceHipster = SpaceHipster || {};

SpaceHipster.GameState = {

  //initiate game settings
  init: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
    this.PLAYER_SPEED = 300;
    this.BULLET_SPEED = -1000;
    
  },

  //load the game assets before the game starts
  preload: function() {
    this.load.image('space', 'assets/images/space.png');    
    this.load.image('player', 'assets/images/player.png');    
    this.load.image('bullet', 'assets/images/bullet.png');    
    this.load.image('enemyParticle', 'assets/images/enemyParticle.png');    
    this.load.spritesheet('yellowEnemy', 'assets/images/yellow_enemy.png', 50, 46, 3, 1, 1);   
    this.load.spritesheet('redEnemy', 'assets/images/red_enemy.png', 50, 46, 3, 1, 1);   
    this.load.spritesheet('greenEnemy', 'assets/images/green_enemy.png', 50, 46, 3, 1, 1);   

    
  },
  //executed after everything is loaded
  create: function() {

    
    //add the scrolling background
    this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
    this.background.autoScroll(0, 30);
    
    //add the player
    this.player = this.add.sprite(this.game.world.centerX, this.game.world.height -50, 'player');
    this.player.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;
    this.player.customParams = {score: 0};
    this.player.customParams = {hp: 3};
    
    //add bullets
    this.initBullets();
    this.initEnemyBullets();
    this.playerShootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND/3, this.createPlayerBullet, this);
    //this.enemyShootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND/2, this.createEnemyBullet, this);
    
    
    //initiate enemies
    this.initEnemies();
    this.enemyTimer = this.game.time.events.loop(Phaser.Timer.SECOND*2,this.createEnemy, this);
    
    
    //Start text
    var style = {font: '60px Arial', fill: '#fff'};
		this.startText = this.game.add.text(this.game.world.width*0.5, this.game.world.height*0.5, 'Start', style);
		this.startText.anchor.setTo(0.5);
		this.removeStartText = this.game.time.events.loop(Phaser.Timer.SECOND*2, this.clearStartText, this);
    
    //scoreboard text
    var style2 = {font: '20px Arial', fill: '#fff'};
		this.scoreText = this.game.add.text(this.game.world.width*0.95, this.game.world.height*0.05, 'Score: ' + this.player.customParams.score, style2);
		this.scoreText.anchor.setTo(1);
		


    
  },
  addPoints: function(x){
    this.player.customParams.score += 1;
  },
  refreshScore: function(){
    this.scoreText.text = 'Score: ' + this.player.customParams.score;
  },
  
  clearStartText: function(){
    this.startText.setText('');
  },
  update: function() {
    this.game.physics.arcade.overlap(this.playerBullets, this.enemies, this.damageEnemy, null, this);
    this.game.physics.arcade.overlap(this.playerBullets, this.enemies, this.enemies.hitAnimation);
    this.refreshScore();
    this.player.body.velocity.x = 0;
    
    if(this.cursors.left.isDown){
      this.player.body.velocity.x = -this.PLAYER_SPEED;
    }else if(this.cursors.right.isDown){
      this.player.body.velocity.x = this.PLAYER_SPEED;
    }
    
    
    if(this.game.input.activePointer.isDown){
      var targetX = this.game.input.activePointer.position.x;
      //ternary operation
      var direction = targetX >= this.game.world.centerX ? 1: -1;
      
      this.player.body.velocity.x = direction * this.PLAYER_SPEED;
    }
  },
  
  initBullets: function(){
    this.playerBullets = this.add.group();
    this.playerBullets.enableBody = true;
    
  },
  createPlayerBullet: function(){
    var bullet = this.playerBullets.getFirstExists(false);
    
    if(!bullet) {
      bullet = new SpaceHipster.PlayerBullet(this.game, this.player.x, this.player.top);
      this.playerBullets.add(bullet);
    }else{
      bullet.reset(this.player.x, this.player.top);
    }
    bullet.body.velocity.y = this.BULLET_SPEED;
  },
  
  initEnemyBullets: function() {
    this.enemyBullets = this.add.group();
    this.enemyBullets.enableBody = true;
  },
  
  createEnemyBullets: function(){
    var enemyBullet = this.enemyBullets.getFirstExists(false);
    
    if(!enemyBullet){
      enemyBullet = new SpaceHipster.PlayerBullet(this.game, this.Enemy.x, this.Enemy.bottom);
      this.enemyBullets.add(enemyBullet);
    }else{
      enemyBullet.reset(this.Enemy.x, this.Enemy.bottom);
    }
    enemyBullet.body.velocity.y = this.BULLET_SPEED * -1;
  },
  
  initEnemies: function(){
    this.enemies = this.add.group();
    this.enemies.enableBody = true;
    
  },

  randEnemy: function(){
    this.rnd = this.getRandomInt(1, 4);
    this.hpMultiplier = 3;
    this.rndHp = this.rnd * this.hpMultiplier;

    if(this.rnd == 1){
      this.rndEnemyKey = 'greenEnemy';
    }else if(this.rnd == 2){
      this.rndEnemyKey = 'yellowEnemy';
    }else if(this.rnd == 3){
      this.rndEnemyKey = 'redEnemy';
    }
  },
  
  createEnemy: function(){
    var enemy = this.enemies.getFirstExists(false);
    this.randEnemy();
    
    //if you change this, remember to change ln:171 ffs!
    if(this.enemies.children.length < 50){
      enemy = new SpaceHipster.Enemy(this.game, 100, 100, this.rndEnemyKey, this.rndHp, []);
      this.enemies.add(enemy);
      //this.enemyShootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND/2, this.createEnemyBullet, this);
      console.log(enemy.health);
    }else {
      //var enemyChildIndex = this.enemies.getAt(this.getRandomInt);
      //var enemyResetHp;
      enemy = this.enemies.getAt(this.getRandomInt(0, 50));
      console.log(enemy.key);
      var resetHp = 0;
      if(enemy.key == 'greenEnemy'){
        resetHp = 1 * this.hpMultiplier;
      }else if(enemy.key == 'yellowEnemy'){
        resetHp = 2 * this.hpMultiplier;
      }else if(enemy.key == 'redEnemy'){
        resetHp = 3 * this.hpMultiplier;
      }
      
      enemy.reset(100,100, resetHp);
      //this.enemyShootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND/2, this.createEnemyBullet, this);
      console.log(enemy.health);
    }

    enemy.body.velocity.x = 100;
    enemy.body.velocity.y = 20;
    
  },

  damageEnemy: function(bullet, enemy){
    //apply damage
    enemy.damage(2);
    enemy.animations.play('getHit');
    //kill the bullet sprite
    bullet.kill();
    //console.log(this.enemy.health);
    //add a point and update score if this also kills the enemy
    if(enemy.health<=0){
      this.addPoints();
      
    }
  },
  getRandomInt: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

};