/*
Load the required packages
 */
var express = require("express");
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Game = require("./serverGame").Game;
var Player = require("./serverPlayer").Player;
var Utils = require("./utils").Utils;
var games = [];

/**
 * Function that creates a bot to reduce the waiting time of
 * the connected players.
 * 
 */
var createBot = function(){
  addPlayerToGame();
};

/**
 * Function that adds a player to an available game.
 * 
 * @param {object} socket     The Socket.IO object of the connected client.
 */
var addPlayerToGame = function(socket){
  var currentGame = games[games.length-1];
  if(currentGame.canHostPlayer() == false){
    currentGame = new Game(games.length + 1);
    games.push(currentGame);
  }

  var playerAdded = currentGame.addPlayer(socket);

  if(playerAdded){
    var _connectedPlayers = currentGame.getConnectedPlayers();
    if(playerAdded.socket){
      playerAdded.socket.emit("player connected", {connectedPlayers: _connectedPlayers, playerName: playerAdded.name});
    }

    if(currentGame.canHostPlayer() == true){
      // set a timeout for creating a bot and avoid boring the player
      setTimeout(createBot, Utils.getRandomInt(2, 5) * 1000);
    }
  }
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile('index.html');
});

//Function executed when a player clicks the "PLAY" button on the main screen.
io.on('connection', function(socket){
  addPlayerToGame(socket);
});

http.listen(3000, function(){
  games.push(new Game(games.length + 1));
  console.log('listening on *:3000');
});