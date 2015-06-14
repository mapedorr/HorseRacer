/**************************************************
** GAME CLASS
**************************************************/
var Player = require("./Player").Player;

var Game = function(_gameId){
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
      var newPlayer = new Player(socketObj.id, playerName, socketObj);
      players.push(newPlayer);
      console.log("New player is picking a horse: " + socketObj.id, "\nIt's name will be: " + playerName);

      // Listen for new player message
      socketObj.on("horse selected", newPlayer.onHorseSelected);

      // Listen for client disconnected
      socketObj.on("disconnect", newPlayer.onClientDisconnect);
      return {name: playerName};
    }else{
      console.log("Maximum players limit reached in game: ", this.gameId);
      return null;
    }
  };

  var _getSelectedHorses = function(){
    var selectedHorses = "";
    for (var i = 0; i < players.length - 1; i++) {
      selectedHorses += players[i].getHorseName();
      if(i < players.length - 2){
        selectedHorses+=",";
      }
    };
    return selectedHorses;
  };

  var _getPlayerById = function(id) {
    for (var i = 0; i < players.length; i++) {
      if (players[i].id == id)
        return players[i];
    };
    
    return false;
  };

  return {
    addPlayer: _addPlayer,
    getSelectedHorses: _getSelectedHorses
  };

};

exports.Game = Game;