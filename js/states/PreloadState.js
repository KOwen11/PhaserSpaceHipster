var SpaceHipster = SpaceHipster || {};

SpaceHipster.PreloadState = {
  //load the game assets before the game starts
    
    
    
    preload: function() {
        this.load.image('space', 'assets/images/space.png');    
        this.load.image('player', 'assets/images/player.png');    
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