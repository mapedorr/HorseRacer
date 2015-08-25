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
var games = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile('index.html');
});

//Function executed when a player clicks the "PLAY" button on the main screen.
io.on('connection', function(socket){
  if(games[games.length-1].canHostPlayer() == false){
    games.push(new Game(games.length + 1));
  }
  var currentGame = games[games.length-1];
  var playerAdded = currentGame.addPlayer(socket);
  if(playerAdded){
    var _connectedPlayers = currentGame.getConnectedPlayers();
    playerAdded.socket.emit("player connected", {connectedPlayers: _connectedPlayers, playerName: playerAdded.name});
  }
});

http.listen(3000, function(){
  games.push(new Game(games.length + 1));
  console.log('listening on *:3000');
});