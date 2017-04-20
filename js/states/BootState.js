var SpaceHipster = SpaceHipster || {};

SpaceHipster.BootState = {
  //load the game assets before the game starts
    
    
    
    preload: function() {
        this.load.image('space', 'assets/images/space.png');    
        this.load.image('player', 'assets/images/player.png');    
        

    },
    
    create: function() {
        SpaceHipster.game.state.start('PreloadState');
    }
};