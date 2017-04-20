var SpaceHipster = SpaceHipster || {};

SpaceHipster.HomeState = {
    create: function() {
        //add the scrolling background
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
        this.background.autoScroll(0, 30);
        
        this.startButton = this.add.sprite(this.game.world.centerX, 450, 'player');
        this.startButton.anchor.setTo(0.5);
        this.startButton.inputEnabled = true;
        this.startButton.events.onInputDown.add(this.start, this);
        
        
    }, 
    start: function() {
        this.state.start('GameState');
    }
};