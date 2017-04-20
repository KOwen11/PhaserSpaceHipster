var SpaceHipster = SpaceHipster || {};

SpaceHipster.PreloadState = {
  //load the game assets before the game starts

    preload: function() {
        //add the scrolling background
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
        this.background.autoScroll(0, 30);
        
        this.preloadSpinner = this.add.sprite(this.game.world.width*0.5, this.game.world.height*0.5, 'player');
        this.preloadSpinner.anchor.setTo(0.5);
        this.preloadSpinner.scale.set(2);
        var spin = this.game.add.tween(this.preloadSpinner);
        spin.to({angle: '+360'}, 1000);
        spin.loop(true);
        
        
        this.load.image('bullet', 'assets/images/bullet.png');    
        this.load.image('enemyParticle', 'assets/images/enemyParticle.png');    
        this.load.spritesheet('yellowEnemy', 'assets/images/yellow_enemy.png', 50, 46, 3, 1, 1);   
        this.load.spritesheet('redEnemy', 'assets/images/red_enemy.png', 50, 46, 3, 1, 1);   
        this.load.spritesheet('greenEnemy', 'assets/images/green_enemy.png', 50, 46, 3, 1, 1);   
        this.load.audio('youDied', ['assets/audio/youDied.mp3', 'assets/audio/youDied.ogg']);
        this.load.audio('enemySpawn', ['assets/audio/fastinvader4.wav']);
        this.load.audio('enemyExplode', ['assets/audio/invaderkilled.wav']);
        this.load.audio('explosion', ['assets/audio/explosion.wav']);
        this.load.audio('playerGun', ['assets/audio/shoot.wav']);

    },
    
    create: function() {
        SpaceHipster.game.state.start('HomeState');
    }
    
};