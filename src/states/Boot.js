var HorseRacer = HorseRacer || {};

HorseRacer.Boot = function(game){
};

/**
 * Method that loads the assets for showing something while
 * Phaser loads the required assets for rendering the game.
 * 
 */
HorseRacer.Boot.prototype.preload = function(){
  this.game.stage.backgroundColor = 0xFFFFFF;
  //Load the image to use for showing the loading process
  this.load.image('loading_progress', 'assets/images/loading_bar.png');
};

/**
 * Method used for configuring the scale manager for the game.
 * 
 */
HorseRacer.Boot.prototype.create = function(){
  this.input.maxPointers = 1;
  this.stage.disableVisibilityChange = true;
  this.game.antialias = true;
  this.stage.smoothed = true;
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.scale.setScreenSize();
  if (!this.game.device.desktop) {
    this.scale.setMinMax(320, 480, 800, 600);
    this.scale.refresh();
  }
};

/**
 * Method that calls the Preloader state.
 * 
 */
HorseRacer.Boot.prototype.update = function () {
  this.state.start('Preloader');
};