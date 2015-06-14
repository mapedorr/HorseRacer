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
  coco = this;
};

HorseRacer.MainMenu.prototype.preload = function(){
};

HorseRacer.MainMenu.prototype.create = function(){
  //Initiate the socket connection to the server.
  socket = io();

  // @TODO Add the elements to show in the main menu screen ("Pick a horse!" screen)
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

  horseThumb = this.horsesGroup.add(this.game.add.sprite(initialXPos + 160, initialYPos, 'horse02_thumb', 0));
  horseThumb.horseId = 2;
  horseThumb.horseName = "Rocky";
  horseThumb.inputEnabled = true;
  horseThumb.input.useHandCursor = true;
  horseThumb.events.onInputDown.add(this.pickHorse, this);

  horseThumb = this.horsesGroup.add(this.game.add.sprite(initialXPos, initialYPos + 240, 'horse03_thumb', 0));
  horseThumb.horseId = 3;
  horseThumb.horseName = "Yegua";
  horseThumb.inputEnabled = true;
  horseThumb.input.useHandCursor = true;
  horseThumb.events.onInputDown.add(this.pickHorse, this);

  horseThumb = this.horsesGroup.add(this.game.add.sprite(initialXPos + 160, initialYPos + 240, 'horse04_thumb', 0));
  horseThumb.horseId = 4;
  horseThumb.horseName = "Viejo";
  horseThumb.inputEnabled = true;
  horseThumb.input.useHandCursor = true;
  horseThumb.events.onInputDown.add(this.pickHorse, this);

  this.setEventHandlers();

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
  this.showPlayerName(spriteObj);
  this.pickedHorse = spriteObj.horseId;
  this._setDisable(spriteObj, spriteObj.horseId);

  socket.emit("horse selected", {name: this.pickedHorse});

  //Start the game
  //  this.state.start('Game', true, false, this.pickedHorse);
};

HorseRacer.MainMenu.prototype.setEventHandlers = function(){
  // Socket connection successful
  socket.on("player connected", onPlayerConnected);
  
  // Socket disconnection
  socket.on("disconnect", onSocketDisconnect);
  
  // New player message received
  socket.on("opponent horse selected", onNewOpponent);
  
  // Player move message received
  // socket.on("move player", onMovePlayer);
  
  // Player removed message received
  // socket.on("remove player", onRemovePlayer);
};

HorseRacer.MainMenu.prototype.disableHorse = function(_horseId){
  this.horsesGroup.forEach(this._setDisable, this, true, _horseId);
};

HorseRacer.MainMenu.prototype._setDisable = function(spriteObj, id){
  if(spriteObj.horseId == id){
    spriteObj.frame = 1;
    spriteObj.inputEnabled = true;
    spriteObj.input.useHandCursor = true;
  }
};

HorseRacer.MainMenu.prototype.setPlayerName = function(_playerName){
  this.playerName = _playerName;
};

HorseRacer.MainMenu.prototype.showPlayerName = function(spriteObj){
  //Create the group for the texts
  this.textBitmapsGroup = this.game.make.group();

  //Draw the player name
  this.playerNameTextBitmap = this.game.make.bitmapText(spriteObj.width / 2, 16, this.fontId, this.playerName, 12);
  this.playerNameTextBitmap.anchor.set(0.5, 0.5);
  this.playerNameTextBitmap.align = "center";
  this.playerNameTextBitmap.tint = 0xfafafa;

  //Draw the funny text
  this.playerHorseTextBitmap = this.game.make.bitmapText(spriteObj.width / 2, 40, this.fontId, "es " + spriteObj.horseName, 10);
  this.playerHorseTextBitmap.anchor.set(0.5, 0.5);
  this.playerHorseTextBitmap.align = "center";
  this.playerHorseTextBitmap.tint = 0xe5e5e5;

  this.textBitmapsGroup.add(this.playerNameTextBitmap);
  this.textBitmapsGroup.add(this.playerHorseTextBitmap);

  spriteObj.addChild(this.textBitmapsGroup);
};








// Socket connected
function onPlayerConnected(data) {
    console.log("Connected to socket server");
    console.log("Locked horses: ", data.selectedHorses);

    //Put an alpha on the selected horses
    if(data.selectedHorses){
      var selectedHorses = data.selectedHorses.split(",");
      for (var i = 0; i < selectedHorses.length; i++) {
        coco.disableHorse(selectedHorses[i]);
      };
    }

    //Show the name the server give me
    coco.setPlayerName(data.playerName[0]);


    // Send local player data to the game server
    // socket.emit("new player", {x: player.x, y:player.y});
};

// Socket disconnected
function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

// New player
function onNewOpponent(data) {
    console.log("New player connected: "+data.horseName);
    coco.disableHorse(data.horseName);

    // Add new player to the remote players array
    //  enemies.push(new RemotePlayer(data.id, game, player, data.x, data.y));
};

/*// Move player
function onMovePlayer(data) {
    
    var movePlayer = playerById(data.id);
    // Player not found
    if (!movePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };
    // Update player position
    movePlayer.player.x = data.x;
    movePlayer.player.y = data.y;
    
};

// Remove player
function onRemovePlayer(data) {
    var removePlayer = playerById(data.id);
    // Player not found
    if (!removePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };
    removePlayer.player.kill();
    // Remove player from array
    enemies.splice(enemies.indexOf(removePlayer), 1);
};*/

function render () {
}

// Find player by ID
function playerById(id) {
    var i;
    for (i = 0; i < enemies.length; i++) {
        if (enemies[i].player.name == id)
            return enemies[i];
    };
    
    return false;
};