var SpaceHipster = SpaceHipster || {};

//initiate the Phaser framework
SpaceHipster.game = new Phaser.Game(600, 900, Phaser.AUTO);

SpaceHipster.game.state.add('GameState', SpaceHipster.GameState);
SpaceHipster.game.state.start('GameState');    