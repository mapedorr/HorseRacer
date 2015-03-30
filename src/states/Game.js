var HorseRacer = HorseRacer || {};

HorseRacer.Game = function(game){
  this.playerHorse = null;
  this.horseNames = ["Amateur", "Rocky", "Yegua", "Viejo"];
  this.drawedHorses = [];
  this.horsesGroup = null;
  this.raceTracks = null;
};

HorseRacer.Game.prototype.init = function(pickedHorseKey){
  this.playerHorse = pickedHorseKey;
};

HorseRacer.Game.prototype.preload = function(){

};

HorseRacer.Game.prototype.create = function(){
  var _me = this;
  var initialXPos = this.game.width / 2 - 160;
  var initialYPos = 0;
  var trackHeight = 48;//64 - 16
  var horseHeight = 32;

  //Draw the race tracks
  this.raceTracks = this.game.add.tileSprite(initialXPos, initialYPos, 320, 256, 'race_track');

  //Add the horses in order of selection
  this.horsesGroup = this.game.add.group(undefined, "horses");

  this.horsesGroup.add(this.game.add.sprite(initialXPos, trackHeight - horseHeight, 'horse' + this.horseNames[this.playerHorse - 1]));
  this.horseNames.splice(this.playerHorse - 1, 1);

  //Add the other horses
  this.horseNames.forEach(function(horseName, index){
    _me.horsesGroup.add(_me.game.add.sprite(initialXPos, trackHeight*(index + 2) + ( 16 * (index+1) ) - horseHeight, 'horse' + _me.horseNames[index]));
    _me.horseNames.splice(index, 0);
  });
};
