/*
Load the required packages
 */
var express = require("express");
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Game = require("./Game").Game;
var Player = require("./Player").Player;
var games = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile('index.html');
});

//Function executed when a player clicks the "PLAY" button on the main screen.
io.on('connection', function(socket){
  var playerAdded = games[0].addPlayer(socket);
  if(playerAdded){
    var _connectedPlayers = games[0].getConnectedPlayers();
    this.emit("player connected", {connectedPlayers: _connectedPlayers, playerName: playerAdded.name});
  }else{
    //TODO: Put the player in a new game!!!
    
  }
});

http.listen(3000, function(){
  games.push(new Game(games.length + 1, io));
  console.log('listening on *:3000');
});