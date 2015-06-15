/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(playerId, playerName, playerSocket) {
  var id = playerId;
  var name = playerName;
  var socket = playerSocket;
  var horseName = "";

  //-----------------------
  //Getters and setters
  var _getHorseName = function() {
    return horseName;
  };

  var _setHorseName = function(_horseName) {
    horseName = _horseName;
  };

  var _getName = function() {
    return name;
  };

  var _setName = function(_name) {
    name = _name;
  };

  //-----------------------
  //Communication

  // New player has joined
  var _onHorseSelected = function(data) {
    _setHorseName(data.name);

    //Broadcast selected horse to connected sockets
    //  socket.broadcast.emit("opponent horse selected", {horseName: data.name});
    socket.broadcast.emit("opponent horse selected", {
      horseId: horseName,
      name: name[0]
    });
  };

  // Socket client has disconnected
  function _onClientDisconnect() {
    console.log("Player has disconnected: " + id);
  };

  // Define which variables and methods can be accessed
  return {
    getHorseName: _getHorseName,
    setHorseName: _setHorseName,
    getName: _getName,
    setName: _setName,
    id: id,
    onHorseSelected: _onHorseSelected,
    onClientDisconnect: _onClientDisconnect
  }

};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;