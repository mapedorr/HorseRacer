var HorseRacer = HorseRacer || {};

HorseRacer.StartScreen = function(game){
  this.startScreenImage = null;
  this.playButton = null;
};

HorseRacer.StartScreen.prototype.preload = function(){
};

HorseRacer.StartScreen.prototype.create = function(){
  //  this.startScreenImage = this.add.image(this.world.width/2, this.world.height/2 - 65, 'start_screen');
  this.startScreenImage = this.add.image(this.world.width/2, 0, 'start_screen');
  this.startScreenImage.anchor.set(0.5, 0);
  this.playButton = this.add.button(this.world.width/2 - 200, 
    this.world.height - 128, 
    'playButton', 
    this.startGame, this, 1,0,2);
  this.playButton.scale.setTo(1,1);
  this.playButton.input.useHandCursor = true;
};

HorseRacer.StartScreen.prototype.update = function(){
  // @TODO
};

/**
 * Method called when a horse is selected by the player.
 * This make the game begins.
 * 
 * @return {[type]} [description]
 */
HorseRacer.StartScreen.prototype.startGame = function(spriteObj, pointer){
  //Start the game
  this.state.start('MainMenu');
};