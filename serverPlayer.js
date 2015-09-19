var Utils = require("./utils").Utils;

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(playerId, playerName, playerSocket, hostGame) {
  var id = playerId || hostGame.getConnectedPlayers().length + 1;
  var name = playerName;
  var socket = playerSocket;
  var horseName = "";
  var hostGame = hostGame;
  var madeMovement = 0;
  var finalPosition = null;
  var isBot = playerSocket == null || playerSocket == undefined;

  // ----------------------
  // bot functions
  var _botSelectHorse = function(){
    // create a random timer to pick a horse
    setTimeout(function(){
      do{
        _onHorseSelected({name: Math.floor((Math.random()*4) + 1)});
      }while(!horseName);
      hostGame.playerReady();
    }, Utils.getRandomInt(2, 4) * 1000);
  };

  var _botAnswerQuestion = function(){
    // create a random timer to pick a horse
    setTimeout(function(){
      var r = Utils.getRandomInt(1, 4);
      var proba = Math.random();
      if(proba <= 0.8){
        // pick the correct answer
        r = hostGame.getCorrectAnswer();
      }
      _onAnswerQuestion({
        response: r,
        responseTime: 1
      });
    }, Utils.getRandomInt(2, 6) * 1000);
  };

  // -----------------------
  // getters and setters
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
    if(isBot == false){
      socket.emit("valid horse");
      // broadcast selected horse to connected sockets
      // socket.broadcast.emit("opponent horse selected", {
      //   horseId: horseName,
      //   name: name[0]
      // });
    }

    hostGame.emitToOthers(id,
      "opponent horse selected",
      {
        horseId: horseName,
        name: name[0]
      }
    );

    //Notify to the host game that the player has selected its horse
    hostGame.playerSelectHorse();
  };

  // Socket client has disconnected
  var _onClientDisconnect = function() {
    // notify the host game that the player is disconnected
    hostGame.disconnectPlayer(id);
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
    if(isBot == false){
      socket.emit("move horse", {amount: movementDistance});
      // socket.broadcast.emit("move opponent", {horseId: horseName, amount: movementDistance});
    }else{
      // bots moves their horses as fast as light
      setTimeout(_onHorseMoved, 1000);
    }

    hostGame.emitToOthers(id,
      "move opponent",
      {
        horseId: horseName,
        amount: movementDistance
      }
    );

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
    if(isBot == false){
      socket.emit("finish reached", {position: finalPosition});
      // socket.broadcast.emit("opponent finished", {horseId: horseName, position: finalPosition});
    }

    hostGame.emitToOthers(id,
      "opponent finished",
      {
        horseId: horseName,
        position: finalPosition
      }
    );
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

  var _getId = function(){
    return id;
  };

  var _getIsBot = function(){
    return isBot;
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
    getId: _getId,
    onHorseSelected: _onHorseSelected,
    onClientDisconnect: _onClientDisconnect,
    onAnswerQuestion: _onAnswerQuestion,
    onHorseMoved: _onHorseMoved,
    sendPosition: _sendPosition,
    botSelectHorse: _botSelectHorse,
    botAnswerQuestion: _botAnswerQuestion,
    getIsBot: _getIsBot
  }

};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;