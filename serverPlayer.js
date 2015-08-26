/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(playerId, playerName, playerSocket, hostGame) {
  var id = playerId;
  var name = playerName;
  var socket = playerSocket;
  var horseName = "";
  var hostGame = hostGame;
  var madeMovement = 0;
  var finalPosition = null;

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
    // search if the picked name is not selected by other player
    if(hostGame.verifyNameAvailability(data.name) == false){
      return;
    }

    _setHorseName(data.name);
    socket.emit("valid horse");

    //Broadcast selected horse to connected sockets
    socket.broadcast.emit("opponent horse selected", {
      horseId: horseName,
      name: name[0]
    });

    //Notify to the host game that the player has selected its horse
    hostGame.playerSelectHorse(socket);
  };

  // Socket client has disconnected
  var _onClientDisconnect = function() {
    console.log("Player has disconnected: " + id);
  };

  // answered the question, notify this to all
  var _onAnswerQuestion = function(data){
    // broadcast moved horse to connected sockets
    var movementDistance = 0;
    var responseTime = data.responseTime;
    var response = data.response;
    if(response && responseTime){
      // the player has responded
       movementDistance = hostGame.verifyAndCalculate(response);
    }

    madeMovement += movementDistance;
    socket.emit("move horse", {amount: movementDistance});
    socket.broadcast.emit("move opponent", {horseId: horseName, amount: movementDistance});
  };

  var _onHorseMoved = function(){
    hostGame.playerReadyForQuestion();

    if(finalPosition){
      return;
    }

    if(hostGame.finishLineReached(madeMovement) == true){
      finalPosition = hostGame.getPodiumPositionText();
      hostGame.verifyGameEnded();
      _sendPosition();
    }
  };

  var _sendPosition = function(){
    socket.emit("finish reached", {position: finalPosition});
    socket.broadcast.emit("oponent finished", {horseId: horseName, position: finalPosition});
  };

  var _setFinalPosition = function(newPosition){
    finalPosition = newPosition;
  };

  var _getFinalPosition = function(){
    return finalPosition;
  };

  var _getSocket = function(){
    return socket;
  };

  // Define which variables and methods can be accessed
  return {
    getHorseName: _getHorseName,
    setHorseName: _setHorseName,
    getName: _getName,
    setName: _setName,
    getSocket: _getSocket,
    setFinalPosition: _setFinalPosition,
    getFinalPosition: _getFinalPosition,
    id: id,
    onHorseSelected: _onHorseSelected,
    onClientDisconnect: _onClientDisconnect,
    onAnswerQuestion: _onAnswerQuestion,
    onHorseMoved: _onHorseMoved,
    sendPosition: _sendPosition
  }

};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;