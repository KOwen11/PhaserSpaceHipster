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


  //executed after everything is loaded
  create: function() {

    
    this.playerHealth = 3;
    
    
    //add the scrolling background
    this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
    this.background.autoScroll(0, 30);
    
    //add the player
    this.player = this.add.sprite(this.game.world.centerX, this.game.world.height -50, 'player', 3);
    this.player.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;
    this.player.customParams = {score: 0};

    
    
		//DON'T FREAKING DO THIS!!! 
		//this.player.customParams = {hp:3};
    
    //add bullets
    this.initBullets();
    this.initEnemyBullets();
    //this.playerShootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND/3, this.createPlayerBullet, this);
    //this.enemyShootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND/2, this.createEnemyBullet, this);
    this.playerTimer = this.game.time.create(false);
    this.playerTimer.start();
    
    this.schedulePlayerShooting();
    
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
		this.scoreText = this.game.add.text(this.game.world.width*0.85, this.game.world.height*0.05, 'Score: ' + this.player.customParams.score, style2);
		this.livesText = this.game.add.text(this.game.world.width*0.85, this.game.world.height*0.07, 'Lives: ' + this.playerHealth, style2);

		this.scoreText.anchor.setTo(0);
		this.livesText.anchor.setTo(0);
		 
    
    
    
    //audio
    this.youDied = this.add.audio('youDied');
    this.enemySpawn = this.add.audio('enemySpawn');
    this.playerLaser = this.add.audio('playerGun');
    this.laser2 = this.add.audio('laser2');
    this.laser3 = this.add.audio('laser3');
    this.enemyExplode = this.add.audio('enemyExplode');
    this.explosion = this.add.audio('explosion');
    
  },
  
  update: function() {
    this.game.physics.arcade.overlap(this.enemyBullets, this.player, this.damagePlayer);
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
  
  addPoints: function(){
    this.player.customParams.score += 1;
  },
  refreshScore: function(){
    this.scoreText.text = 'Score: ' + this.player.customParams.score;
    this.livesText.text = 'Lives: ' + this.playerHealth;
  },
  
  schedulePlayerShooting: function(){
    this.createPlayerBullet();
    
    //console.log(this.shootHz);
    this.playerTimer.add(Phaser.Timer.SECOND / 5, this.schedulePlayerShooting, this);
  },
  
  playLaser: function(){
    this.playerLaser.play();
  },
  
  clearStartText: function(){
    this.startText.setText('');
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
      enemyBullet = new SpaceHipster.EnemyBullet(this.game, this.Enemy.x, this.Enemy.bottom);
    }else{
      enemyBullet.reset(this.Enemy.x, this.Enemy.bottom);
    }
    enemyBullet.body.velocity.y = this.BULLET_SPEED * -1;
      
  },
  
  initEnemies: function(){
    this.enemies = this.add.group();
    this.enemies.enableBody = true;
    
    this.enemyBullets = this.add.group();
    this.enemyBullets.enableBody = true;
    
  },

  randEnemy: function(){
    this.rnd = this.getRandomInt(1, 4);
    this.hpMultiplier = 5;
    this.rndHp = this.rnd * this.hpMultiplier;

    if(this.rnd == 1){
      this.rndEnemyKey = 'greenEnemy';
    }else if(this.rnd ==2 ){
      this.rndEnemyKey = 'yellowEnemy';
    }else if(this.rnd == 3){
      this.rndEnemyKey = 'redEnemy';
    }
  },
  
  createEnemy: function(){

      var enemy = this.enemies.getFirstExists(false);
      this.randEnemy();
      

      if(this.enemies.children.length < 50){

        enemy = new SpaceHipster.Enemy(this.game, 100, 100, this.rndEnemyKey, this.rndHp, this.enemyBullets, this.rnd);
        this.enemies.add(enemy);
        this.enemySpawn.play();
      }else {

        enemy = this.enemies.getAt(this.getRandomInt(0, 50));

        var resetHp = 0;
        if(enemy.key == 'greenEnemy'){
          resetHp = 1 * this.hpMultiplier;
        }else if(enemy.key == 'yellowEnemy'){
          resetHp = 2 * this.hpMultiplier;
        }else if(enemy.key == 'redEnemy'){
          resetHp = 3 * this.hpMultiplier;
        }
        
        enemy.reset(100,100, resetHp);
        enemy.enemyTimer.resume();
        this.enemySpawn.play();
      }
    

    enemy.body.velocity.x = 100;
    enemy.body.velocity.y = 50;
    
  },
  
  

  damagePlayer: function(enemyBullet, player){
    
    SpaceHipster.GameState.playerHealth -= 1;
    console.log(SpaceHipster.GameState.playerHealth);

    enemyBullet.kill();
    if(SpaceHipster.GameState.playerHealth <= 0){
      SpaceHipster.GameState.killPlayer();
      console.log('killed');
    }else if (SpaceHipster.GameState.playerHealth > 0){
      SpaceHipster.GameState.resetPlayer();
      SpaceHipster.GameState.resetEnemies();

      console.log('reset');
    }
  },
  
  resetEnemies: function(){
    var b = 0;
    for(b; b< this.enemyBullets.children.length; b = b + 1){
      var bulletToStop = this.enemyBullets.getAt(b);
      bulletToStop.kill();
    }
    
    var i = 0;
    for(i; i<this.enemies.children.length ; i = i + 1){
      var enemyToStop = this.enemies.getAt(i);
      enemyToStop.damage(enemyToStop.health * 2);
    }
    
  },
  
  resetPlayer: function() {
    this.player.reset(this.game.world.centerX, this.game.world.height -50);
    this.playerTimer.resume();
    this.explosion.play();
    var emitter = this.game.add.emitter(this.x, this.y, 150);
    emitter.makeParticles('enemyParticle');
    emitter.minParticleSpeed.setTo(-500, -500);
    emitter.maxParticleSpeed.setTo(500, 500);
    emitter.gravity = 0;
    emitter.start(true, 1000, null, 150);
  },
  
  killPlayer: function(){
    var emitter = this.game.add.emitter(this.x, this.y, 150);
    emitter.makeParticles('enemyParticle');
    emitter.minParticleSpeed.setTo(-500, -500);
    emitter.maxParticleSpeed.setTo(500, 500);
    emitter.gravity = 0;
    emitter.start(true, 1000, null, 150);
    this.player.kill();
    this.playerTimer.pause();
    this.youDied.play();
    //you died text
    var style3 = {font: '80px Arial', fill: 'red'};
    this.youDiedText = this.game.add.text(this.game.world.width*0.5, this.game.world.height*0.5, 'YOU DIED', style3);
    this.youDiedText.anchor.setTo(0.5);
    this.restartTimer = this.game.time.events.loop(Phaser.Timer.SECOND*8,this.restart, this);
  },
  
  damageEnemy: function(bullet, enemy){
    //apply damage
    enemy.damage(2);
    bullet.kill();
    
    if(enemy.health<=0){
      this.addPoints();
    }
  },

  getRandomInt: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  },
  
  restart: function(){
    this.game.state.start('HomeState');
  }
  
};