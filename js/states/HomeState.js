var SpaceHipster = SpaceHipster || {};

SpaceHipster.HomeState = {
    create: function() {
        this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
        this.background.autoScroll(0, 30);
        
        this.startButton = this.add.sprite(this.game.world.width*0.5, this.game.world.height*0.5, 'player');
        this.startButton.scale.set(2);
        this.startButton.anchor.setTo(0.5);
        this.startButton.inputEnabled = true;
        this.startButton.events.onInputDown.add(this.start, this);
        this.startSound = this.add.audio('playerGun');
        var style = {font: '100px Impact', fill: '#fff'};
		this.homeText = this.game.add.text(this.game.world.width*0.5, this.game.world.height*0.3, 'Phasers', style);
		this.homeText.anchor.setTo(0.5);
        
    }, 
    start: function() {
        
        this.startSound.play();
        this.state.start('GameState');
    }
};