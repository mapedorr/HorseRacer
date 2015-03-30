var HorseRacer = HorseRacer || {};

HorseRacer.MainMenu = function(game){
  this.horsesGroup = null;
  this.pickedHorse = null;
};

HorseRacer.MainMenu.prototype.preload = function(){
};

HorseRacer.MainMenu.prototype.create = function(){
  // @TODO Add the elements to show in the main menu screen ("Pick a horse!" screen)
  this.horsesGroup = this.game.add.group(undefined, "horse_pick");

  //Each horse thumb is 160 x 240
  var initialXPos = this.game.width / 2 - 160;
  var initialYPos = 0;

  var horseThumb = null;

  //Add the first horse
  horseThumb = this.horsesGroup.add(this.game.add.sprite(initialXPos, initialYPos, 'horse01_thumb'));
  horseThumb.horseId = 1;
  horseThumb.inputEnabled = true;
  horseThumb.input.useHandCursor = true;
  horseThumb.events.onInputDown.add(this.pickHorse, this);

  horseThumb = this.horsesGroup.add(this.game.add.sprite(initialXPos + 160, initialYPos, 'horse02_thumb'));
  horseThumb.horseId = 2;
  horseThumb.inputEnabled = true;
  horseThumb.input.useHandCursor = true;
  horseThumb.events.onInputDown.add(this.pickHorse, this);

  horseThumb = this.horsesGroup.add(this.game.add.sprite(initialXPos, initialYPos + 240, 'horse03_thumb'));
  horseThumb.horseId = 3;
  horseThumb.inputEnabled = true;
  horseThumb.input.useHandCursor = true;
  horseThumb.events.onInputDown.add(this.pickHorse, this);

  horseThumb = this.horsesGroup.add(this.game.add.sprite(initialXPos + 160, initialYPos + 240, 'horse04_thumb'));
  horseThumb.horseId = 4;
  horseThumb.inputEnabled = true;
  horseThumb.input.useHandCursor = true;
  horseThumb.events.onInputDown.add(this.pickHorse, this);

};

HorseRacer.MainMenu.prototype.update = function(){
  // @TODO
};

/**
 * Method called when a horse is selected by the player.
 * This make the game begins.
 * 
 * @return {[type]} [description]
 */
HorseRacer.MainMenu.prototype.pickHorse = function(spriteObj, pointer){
  this.pickedHorse = spriteObj.horseId;
  //Start the game
  this.state.start('Game', true, false, this.pickedHorse);
};