/**************************************************
** GAME CLASS
**************************************************/
var Player = require("./serverPlayer").Player;
var Questions = require("./questions").Questions;

var Game = function(_gameId){
  var gameId = _gameId;
  var GAME_STATES = {CREATED: 0, WAITING: 1, STARTED: 2, ENDED: 4};
  var currentState = GAME_STATES.CREATED;
  var playerNames = ["Naked Snake", "Venom Snake", "Major Tom", "Major Zero", "Solid Snake", "Eva", "The Pain", "The Fear", "The End", "The Fury", "The Sorrow", "The Joy", "The Boss", "Big Boss", "Sniper Wolf", "Crying Wolf", "Raiden", "Vamp", "Gray Fox"];
  var players = null;
  var readyPlayers = 0;
  var QuestionsObj = new Questions();
  var currentQuestion = null;
  var playersPerGame = 4;
  var movedPlayers = 0;
  var movementAmounts = [64, 44, 24, 10];
  var responseOrder = -1;
  var gameWorldWidth = 320;
  var playersWhoEnded = 0;
  var playersAnswering = 0;
  var positionTexts = {"1": "Primero", "2": "Segundo", "3": "Tercero"};

  /**
   * Function that go over the array of players and calls the received function
   * to operate over it.
   * 
   * @param  {Function} cb    The function to call for each element.
   */
  function goOverPlayers(cb){
    for(var i=0; i<players.length; i++){
      var action = cb(players[i], i);
      if(!action || action == 'continue'){
        continue;
      }
      if(action == 'break'){
        break;
      }
    }
  }

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

    playersAnswering++;

    if(currentState == GAME_STATES.WAITING){
      if(players.length === playersPerGame){
        currentState = GAME_STATES.STARTED;
        return null;
      }
      // pick a random name for the player
      var playerName = playerNames.splice(parseInt(Math.random() * playerNames.length), 1);
      var newPlayer = new Player(socketObj.id, playerName, socketObj, this);
      players.push(newPlayer);

      // listen for new player message
      socketObj.on("horse selected", newPlayer.onHorseSelected);

      // listen for client disconnected
      socketObj.on("disconnect", newPlayer.onClientDisconnect);

      // listen for client ready to receive questions
      socketObj.on("ready to play", _playerReady);

      // listen for question request
      socketObj.on("horse moved", newPlayer.onHorseMoved);

      // listen for player answer
      socketObj.on("answer question", newPlayer.onAnswerQuestion);

      return {socket: socketObj, name: newPlayer.getName()};
    }else{
      currentState = GAME_STATES.STARTED;
      return null;
    }
  };

  /**
   * Function that disconnets a player from the current game and notify the
   * other players this action.
   * 
   * @param  {string} playerId    The ID of the player to disconnect.
   */
  var _disconnectPlayer = function(playerId){
    var playerName = null;
    // remove the player from the array and disconnects its socket
    goOverPlayers(function(player, index){
      if(player.getId() == playerId){
        player.getSocket().disconnect();
        playerName = player.getHorseName();
        players.splice(index, 1);
        playersAnswering--;
        return "break";
      }
    });

    // notify to other players the opponent disconnection
    goOverPlayers(function(player, index){
      (player.getSocket()).emit("opponent disconnected", {horseId: playerName});
    });

    // verify if it is necessary to send a question
    if(movedPlayers == playersAnswering){
      movedPlayers = 0;
      _sendRandomQuestion();
    }
  };

  var _getConnectedPlayers = function(){
    var connectedPlayers = [];

    goOverPlayers(function(player, index){
      connectedPlayers.push({
        horseId: player.getHorseName(),
        name: (player.getName())[0]
      });
    });

    return connectedPlayers;
  };

  var _getPlayerById = function(id) {
    var response = false;

    goOverPlayers(function(player, index){
      if (player.getId() == id){
        response = player;
        return 'break';
      }
    });

    return response;
  };

  var _playerSelectHorse = function(playerSocket){
    var playersWithHorse = 0;
    goOverPlayers(function(player, index){
      if(player.getHorseName()){
        playersWithHorse++;
      }
    });

    if(playersWithHorse === playersPerGame){
      // notify to the players that the game have to start
      currentState = GAME_STATES.STARTED;
      var playersData = [];
      goOverPlayers(function(player, index){
        playersData.push({
          playerName: (player.getName())[0],
          playerHorse: player.getHorseName()
        });
      });

      goOverPlayers(function(player, index){
        (player.getSocket()).emit("start race", {gamePlayers: playersData});
      });
    }
  };

  /**
   * This function increments in one the counter for the players ready to start
   * receiving questions.
   * 
   */
  var _playerReady = function(){
    readyPlayers++;
    if(readyPlayers === players.length){
      _sendRandomQuestion();
    }
  };

  /**
   * This function is called when the horse of a player ends its movement. When
   * all the players in the match have finished their movements, the game have
   * to send to them a new question.
   * 
   */
  var _playerReadyForQuestion = function(){
    movedPlayers++;
    if(movedPlayers == playersAnswering){
      movedPlayers = 0;
      _sendRandomQuestion();
    }
  };

  /**
   * This function gets a question from the array of questions and returns it
   * ready for its use in the game.
   * @return {[type]} [description]
   */
  var _sendRandomQuestion = function(){
    var availableQuestions = QuestionsObj.getQuestions();
    if(availableQuestions && availableQuestions.length == 0){
      return;
    }

    var randomNumber = parseInt(Math.random() * (availableQuestions.length-1));
    currentQuestion = availableQuestions.splice(randomNumber, 1)[0];
    QuestionsObj.pushAsUsedQUestion(currentQuestion);
    QuestionsObj.setQuestions(availableQuestions);
    currentQuestion.options.unshift(currentQuestion.response);
    var _question = {
      q: currentQuestion.question,
      o: []
    };
    do{
      randomNumber = parseInt(Math.random() * currentQuestion.options.length);
      _question.o.push(currentQuestion.options.splice(randomNumber, 1)[0]);
    }while(currentQuestion.options.length > 0);
    currentQuestion.options = _question.o;

    // reset the response order indicator
    responseOrder = -1;

    goOverPlayers(function(player, index){
      (player.getSocket()).emit("receive question", {question: _question});
    });
  };

  var _verifyAndCalculate = function(response){
    if(currentQuestion.options[response-1] === currentQuestion.response){
      // correct answer
      responseOrder++;
      return movementAmounts[responseOrder];
    }
    // wrong answer
    return 0;
  };

  var _finishLineReached = function(movementAmount){
    if(movementAmount >= gameWorldWidth){
      // playersAnswering--;
      playersWhoEnded++;
      return true;
    }
    return false;
  };

  var _getPodiumPositionText = function(){
    return "Llegaste " + positionTexts[playersWhoEnded];
  };

  var _verifyGameEnded = function(){
    var response = false;
    if(playersWhoEnded == players.length-1){
      goOverPlayers(function(player, index){
        if(!player.getFinalPosition()){
          player.setFinalPosition("Eres el burro");
          player.sendPosition();
          response = true;
          return 'break';
        }
      });
    }
    return response;
  };

  var _canHostPlayer = function(){
    if(players && 
        (players.length === playersPerGame ||
          currentState === GAME_STATES.STARTED ||
          currentState === GAME_STATES.ENDED
        )
      ){
      return false;
    }
    return true;
  };

  var _verifyNameAvailability = function(nameToValidate){
    var response = true;

    goOverPlayers(function(player, index){
      if(player.getHorseName() && player.getHorseName() == nameToValidate){
        response = false;
        return 'break';
      }
    });

    return response;
  };

  return {
    addPlayer: _addPlayer,
    disconnectPlayer: _disconnectPlayer,
    getConnectedPlayers: _getConnectedPlayers,
    playerSelectHorse: _playerSelectHorse,
    verifyAndCalculate: _verifyAndCalculate,
    playerReadyForQuestion: _playerReadyForQuestion,
    finishLineReached: _finishLineReached,
    getPodiumPositionText: _getPodiumPositionText,
    verifyGameEnded: _verifyGameEnded,
    canHostPlayer: _canHostPlayer,
    verifyNameAvailability: _verifyNameAvailability
  };

};

exports.Game = Game;