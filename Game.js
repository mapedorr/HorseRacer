/**************************************************
** GAME CLASS
**************************************************/
var Player = require("./Player").Player;

var Game = function(_gameId, io){
  var gameId = _gameId;
  var GAME_STATES = {
    CREATED: 'c',
    WAITING: 'w',
    STARTED: 's',
    PLAYING: 'p',
    ENDED: 'e'
  };
  var currentState = GAME_STATES.CREATED;
  var playerNames = ["Naked Snake", "Venom Snake", "Major Tom", "Major Zero", "Solid Snake", "Eva", "The Pain", "The Fear", "The End", "The Fury", "The Sorrow", "The Joy", "The Boss", "Big Boss", "Sniper Wolf", "Crying Wolf", "Raiden", "Vamp", "Gray Fox"];
  var players = null;
  var io = io;

  /**
   * Method that adds a player to the game.
   * 
   * @param {string} socketObj    The socket of the connected player
   */
  var _addPlayer = function(socketObj){
    if(!players && currentState == GAME_STATES.CREATED){
      players = [];
      currentState = GAME_STATES.WAITING;
    }

    if(currentState == GAME_STATES.WAITING){
      if(players.length > 3){
        currentState = GAME_STATES.STARTED;
        return null;
      }
      //Pick a random name for the player
      var playerName = playerNames.splice(parseInt(Math.random() * playerNames.length), 1);
      var newPlayer = new Player(socketObj.id, playerName, socketObj, this);
      players.push(newPlayer);

      // Listen for new player message
      socketObj.on("horse selected", newPlayer.onHorseSelected);

      // Listen for client disconnected
      socketObj.on("disconnect", newPlayer.onClientDisconnect);
      return {name: newPlayer.getName()};
    }else{
      currentState = GAME_STATES.STARTED;
      //  console.log("Maximum players limit reached in game: ", this.gameId);
      
      return null;
    }
  };

  var _getConnectedPlayers = function(){
    var connectedPlayers = [];
    for (var i = 0; i < players.length - 1; i++) {
      connectedPlayers.push({
        horseId: players[i].getHorseName(),
        name: (players[i].getName())[0]
      });
    };
    return connectedPlayers;
  };

  var _getPlayerById = function(id) {
    for (var i = 0; i < players.length; i++) {
      if (players[i].id == id)
        return players[i];
    };
    
    return false;
  };

  var _playerSelectHorse = function(playerSocket){
    if(players.length === 4){
      //Notify to the players that the game have to start
      currentState = GAME_STATES.STARTED;
      io.sockets.emit("start race");
    }
  };

  return {
    addPlayer: _addPlayer,
    getConnectedPlayers: _getConnectedPlayers,
    playerSelectHorse: _playerSelectHorse
  };

};

exports.Game = Game;