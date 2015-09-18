var HorseRacer = HorseRacer || {};

HorseRacer.MainMenu = function(game){
  this.horsesGroup = null;
  this.pickedHorse = null;
  this.playerName = null;
  this.fontSize = 15;
  this.fontId = 'font';
  this.textBitmapsGroup = null;
  this.playerNameTextBitmap = null;
  this.playerHorseTextBitmap = null;
  this.enabledHorses = [];
  this.socket = null;
  this.spriteObjTemp = null;
};

HorseRacer.MainMenu.prototype.preload = function(){
};

HorseRacer.MainMenu.prototype.create = function(){
  //Initiate the socket connection to the server.
  this.socket = io();

  //@TODO Add the elements to show in the main menu screen ("Pick a horse!" screen)
  this.horsesGroup = this.game.add.group(undefined, "horse_pick");

  //Each horse thumb is 160 x 240
  var initialXPos = this.game.width / 2 - 160;
  var initialYPos = 0;

  var horseThumb = null;

  //Add the first horse
  horseThumb = this.horsesGroup.add(this.game.add.sprite(initialXPos, initialYPos, 'horse01_thumb', 0));
  horseThumb.horseId = 1;
  horseThumb.horseName = "Amateur";
  horseThumb.inputEnabled = true;
  horseThumb.input.useHandCursor = true;
  horseThumb.events.onInputDown.add(this.pickHorse, this);
  this.enabledHorses.push(horseThumb.horseId);

  horseThumb = this.horsesGroup.add(this.game.add.sprite(initialXPos + 160, initialYPos, 'horse02_thumb', 0));
  horseThumb.horseId = 2;
  horseThumb.horseName = "Rocky";
  horseThumb.inputEnabled = true;
  horseThumb.input.useHandCursor = true;
  horseThumb.events.onInputDown.add(this.pickHorse, this);
  this.enabledHorses.push(horseThumb.horseId);

  horseThumb = this.horsesGroup.add(this.game.add.sprite(initialXPos, initialYPos + 240, 'horse03_thumb', 0));
  horseThumb.horseId = 3;
  horseThumb.horseName = "Yegua";
  horseThumb.inputEnabled = true;
  horseThumb.input.useHandCursor = true;
  horseThumb.events.onInputDown.add(this.pickHorse, this);
  this.enabledHorses.push(horseThumb.horseId);

  horseThumb = this.horsesGroup.add(this.game.add.sprite(initialXPos + 160, initialYPos + 240, 'horse04_thumb', 0));
  horseThumb.horseId = 4;
  horseThumb.horseName = "Viejo";
  horseThumb.inputEnabled = true;
  horseThumb.input.useHandCursor = true;
  horseThumb.events.onInputDown.add(this.pickHorse, this);
  this.enabledHorses.push(horseThumb.horseId);

  this.setEventHandlers();

};

HorseRacer.MainMenu.prototype.setEventHandlers = function(){
  var _me = this;

  //Socket connection successful
  //  this.socket.on("player connected", onPlayerConnected);
  this.socket.on("player connected", function(data){
    _me.playerConnected(data);
  });
  
  //Socket disconnection
  this.socket.on("disconnect", function(){
    _me.playerDisconnected();
  });

  this.socket.on("valid horse", function(){
    _me.disablePlickedHorse();
  });

  //New player message received
  this.socket.on("opponent horse selected", function(data){
    _me.opponentHorseSelected(data);
  });

  //All players had selected their horses. Start the race.
  this.socket.on("start race", function(data){
    //The "data" object received from the server has the information of the players and
    //will be used for drawing their horses in the order of connection to the game
    if(data && data.gamePlayers){
      _me.startRace(data.gamePlayers);
    }
  });

  this.socket.on("opponent disconnected", function(data){
    _me.removeOpponent(data.horseId);
  });
};

/**
 * Method called when a horse is selected by the player.
 * This make the game begins.
 * 
 * @return {[type]} [description]
 */
HorseRacer.MainMenu.prototype.pickHorse = function(spriteObj, pointer){
  this.spriteObjTemp = spriteObj;
  this.socket.emit("horse selected", {name: spriteObj.horseId});
};

HorseRacer.MainMenu.prototype.disablePlickedHorse = function(){
  this.pickedHorse = this.spriteObjTemp.horseId;
  //Disable the picked horse
  this._setDisabled(this.spriteObjTemp, {horseId: this.spriteObjTemp.horseId, name: this.playerName});

  //Disable the remaining horses
  this.enabledHorses.splice(this.enabledHorses.indexOf(this.spriteObjTemp.horseId), 1);
  for (var i = 0; i < this.enabledHorses.length; i++) {
    this.disableHorse({horseId: this.enabledHorses[i]});
  };
};

//Socket connected
HorseRacer.MainMenu.prototype.playerConnected = function(data) {
    //Lock the selected horses and show the name of all the players
    if(data.connectedPlayers){
      for (var i = 0; i < data.connectedPlayers.length; i++) {
        if(data.connectedPlayers[i].horseId){
          this.enabledHorses.splice(this.enabledHorses.indexOf(data.connectedPlayers[i].horseId), 1);
          this.disableHorse(data.connectedPlayers[i]);
        }
      }
    }

    //Show the name the server gave me
    this.setPlayerName(data.playerName[0]);
};

// socket disconnected by the server
HorseRacer.MainMenu.prototype.playerDisconnected = function() {
  console.log("The fuckin server disconnects me!");
};

/**
 * Method that removes a player from the array of players because its
 * disconnection. This makes enabled its horse if the player hasn't been
 * selected a horse yet.
 * 
 * @param  {number} opponentId    The ID of the horse to remove.
 */
HorseRacer.MainMenu.prototype.removeOpponent = function(opponentId){
  this.horsesGroup.forEach(this._setEnabled, this, true, opponentId);
};

//New player
HorseRacer.MainMenu.prototype.opponentHorseSelected = function(data) {
  this.disableHorse(data);
};

HorseRacer.MainMenu.prototype.startRace = function(gamePlayers){
  this.socket.removeListener("opponent disconnected");
  this.state.start('Game', true, false, gamePlayers, this.pickedHorse, this.socket);
};

HorseRacer.MainMenu.prototype.disableHorse = function(opponentObj){
  this.horsesGroup.forEach(this._setDisabled, this, true, opponentObj);
};

HorseRacer.MainMenu.prototype._setDisabled = function(spriteObj, data){
  if(spriteObj.horseId == data.horseId){
    spriteObj.frame = spriteObj.frame || 1;
    spriteObj.inputEnabled = false;
    spriteObj.input.useHandCursor = false;
    if(data.name){
      spriteObj.frame = 2;
      this.showPlayerName(spriteObj, data.name);
    }
  }
};

HorseRacer.MainMenu.prototype._setEnabled = function(spriteObj, horseId){
  if(spriteObj.horseId == horseId){
    if(this.pickedHorse){
      spriteObj.frame = 1;
    }else{
      spriteObj.frame = 0;
      spriteObj.inputEnabled = true;
      spriteObj.input.useHandCursor = true;
    }
    this.hidePlayerName(spriteObj);
  }
};

HorseRacer.MainMenu.prototype.setPlayerName = function(_playerName){
  this.playerName = _playerName;
};

HorseRacer.MainMenu.prototype.showPlayerName = function(spriteObj, name){
  //Create the group for the texts
  this.textBitmapsGroup = this.game.make.group();

  //Draw the player name
  if(spriteObj.horseId == this.pickedHorse){
    this.playerNameTextBitmap = this.game.make.bitmapText(spriteObj.width / 2,
      16,
      this.fontId,
      "Eres",
      10);
    this.playerNameTextBitmap.anchor.set(0.5, 0.5);
    this.playerNameTextBitmap.align = "center";
    this.playerNameTextBitmap.tint = 0xe5e5e5;
    this.textBitmapsGroup.add(this.playerNameTextBitmap);
  }

  //Draw the funny text
  this.playerHorseTextBitmap = this.game.make.bitmapText(spriteObj.width / 2,
    (spriteObj.horseId == this.pickedHorse) ? 40 : 30,
    this.fontId,
    name,
    12);
  this.playerHorseTextBitmap.anchor.set(0.5, 0.5);
  this.playerHorseTextBitmap.align = "center";
  this.playerHorseTextBitmap.tint = 0xfafafa;
  this.textBitmapsGroup.add(this.playerHorseTextBitmap);

  spriteObj.addChild(this.textBitmapsGroup);
};

HorseRacer.MainMenu.prototype.hidePlayerName = function(spriteObj){
  if(spriteObj.children && spriteObj.children.length > 0){
    spriteObj.removeChildAt(spriteObj.children.length-1);
  }
};

function render () {
}