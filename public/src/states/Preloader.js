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

  //[Font]
  this.load.bitmapFont('font','assets/fonts/carrier_command.png','assets/fonts/carrier_command.xml');

  //[Start screen]
  this.load.image('start_screen', 'assets/images/start_screen.png');
  this.load.spritesheet('playButton','assets/sprites/play_button.png', 400, 128);

  //[Main menu]
  this.load.spritesheet('horse01_thumb', 'assets/sprites/amateur_horsepick.png', 160, 240);// #e55b4c
  this.load.spritesheet('horse02_thumb', 'assets/sprites/rocky_horsepick.png', 160, 240);// #29d7cd
  this.load.spritesheet('horse03_thumb', 'assets/sprites/yegua_horsepick.png', 160, 240);// #95c93a
  this.load.spritesheet('horse04_thumb', 'assets/sprites/viejo_horsepick.png', 160, 240);// #e54cd1

  //[Game]
  this.load.image('race_track', 'assets/images/race_track.png');
  this.load.image('horseAmateur', 'assets/images/AmateurRacer32x32.png');
  this.load.image('horseRocky', 'assets/images/RockyRacer32x32.png');
  this.load.image('horseYegua', 'assets/images/horse03.png');
  this.load.image('horseViejo', 'assets/images/ViejoRacer32x32.png');
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