var SpaceHipster = SpaceHipster || {};

//initiate the Phaser framework
SpaceHipster.game = new Phaser.Game(600, 900, Phaser.AUTO);

SpaceHipster.game.state.add('GameState', SpaceHipster.GameState);
SpaceHipster.game.state.add('PreloadState', SpaceHipster.PreloadState);
SpaceHipster.game.state.add('HomeState', SpaceHipster.HomeState);
SpaceHipster.game.state.add('BootState', SpaceHipster.BootState);
SpaceHipster.game.state.start('BootState');    