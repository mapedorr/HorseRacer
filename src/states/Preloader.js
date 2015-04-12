var HorseRacer = HorseRacer || {};

HorseRacer.Preloader = function(game){
  this.loadingBar = null;
};

/**
 * Method that loads all the assets that will be used in the game.
 * 
 */
HorseRacer.Preloader.prototype.preload = function(){
  var loadingBarHeight = 128;

  this.loadingBar = this.game.add.sprite(0, this.game.world.height / 2 - loadingBarHeight / 2, 'loading_progress');
  this.loadingBar.width = this.game.world.width;
  this.loadingBar.height = loadingBarHeight;
  this.load.setPreloadSprite(this.loadingBar);

  //[Start screen]
  this.load.image('start_screen', 'assets/images/start_screen.png');
  this.load.spritesheet('playButton','assets/sprites/play_button.png', 400, 128);

  //[Main menu]
  this.load.image('horse01_thumb', 'assets/images/big_horse01_thumb.png');//#e55b4c
  this.load.image('horse02_thumb', 'assets/images/big_horse02_thumb.png');//#29d7cd
  this.load.image('horse03_thumb', 'assets/images/big_horse03_thumb.png');//#95c93a
  this.load.image('horse04_thumb', 'assets/images/big_horse04_thumb.png');//#e54cd1

  //[Game]
  this.load.image('race_track', 'assets/images/race_track.png');
  this.load.image('horseAmateur', 'assets/images/horse01.png');
  this.load.image('horseRocky', 'assets/images/horse02.png');
  this.load.image('horseYegua', 'assets/images/horse03.png');
  this.load.image('horseViejo', 'assets/images/horse04.png');
  this.load.spritesheet('runButton','assets/sprites/run_button.png', 400, 128);
};

HorseRacer.Preloader.prototype.create = function(){
  this.loadingBar.cropEnabled = false;
};

/**
 * Method that starts the "Main menu" state when all the required assets
 * are loaded.
 * 
 */
HorseRacer.Preloader.prototype.update = function(){
  this.state.start('StartScreen');
};