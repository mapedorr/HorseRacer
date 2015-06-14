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
var players;
var games = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile('index.html');
});

//Function executed when a player clicks the "PLAY" button on the main screen.
io.on('connection', function(socket){
  var playerAdded = games[0].addPlayer(socket);
  if(playerAdded){
    var _selectedHorses = games[0].getSelectedHorses();

    // for (var i = 0; i < players.length - 1; i++) {
    //   _selectedHorses += players[i].getHorseName();
    //   if(i < players.length - 2){
    //     _selectedHorses+=",";
    //   }
    // };

    console.log("Selected horses: ", _selectedHorses);
    this.emit("player connected", {selectedHorses: _selectedHorses, playerName: playerAdded.name});

  }else{
    //TODO: Put the player in a new game!!!
  }

  console.log("USING THE NEW ONES");
  return;


  players = players || [];
  if(players.length > 3){
    
    console.log("Max players limit reached");
    return;
  }

  var newPlayer = new Player(socket.id);
  players.push(newPlayer);
  console.log("New player is picking a horse: " + socket.id);

  // Listen for new player message
  socket.on("horse selected", onHorseSelected);

  // Listen for client disconnected
  socket.on("disconnect", onClientDisconnect);

  //Emit to the connected player the event that allows him select a horse.
  //This message will contain also the selected horses of other players in the game.
  var _selectedHorses = "";
  for (var i = 0; i < players.length - 1; i++) {
    _selectedHorses += players[i].getHorseName();
    if(i < players.length - 2){
      _selectedHorses+=",";
    }
  };
  console.log("Selected horses: ", _selectedHorses);
  if(_selectedHorses){
    this.emit("player connected", {selectedHorses: _selectedHorses});
  }

  // Listen for move player message
  //  socket.on("move player", onMovePlayer);

  //  var player = players.connectNewPlayer(games, socket);
  //  games.joinPlayer(player);

  //  socket.on('disconnect', player.disconnect);
  //  socket.on('setProgram', player.setProgram);
  //  socket.on('playAgain', player.playAgain);

});

// New player has joined
function onHorseSelected(data) {
  // Create a new player
  var socketPlayer = getPlayerById(this.id);
  socketPlayer.setHorseName(data.name);

  //  var newPlayer = new Player(data.x, data.y);
  //  newPlayer.id = this.id;

  //Broadcast selected horse to connected sockets
  this.broadcast.emit("opponent horse selected", {horseName: data.name});

  // Send existing players to the new player
  // var i, existingPlayer;
  // for (i = 0; i < players.length; i++) {
  //   existingPlayer = players[i];
  //   this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
  // };
    
  // Add new player to the players array
  // players.push(newPlayer);
};

// Socket client has disconnected
function onClientDisconnect() {
  console.log("Player has disconnected: " + this.id);
  //  util.log("Player has disconnected: "+this.id);

  var removePlayer = getPlayerById(this.id);

  // Player not found
  if (!removePlayer) {
    console.log("Player not found: "+this.id);
    //  util.log("Player not found: "+this.id);
    return;
  };

  // Remove player from players array
  players.splice(players.indexOf(removePlayer), 1);

  // Broadcast removed player to connected socket clients
  this.broadcast.emit("remove player", {id: this.id});
};

/**
 * Function for searching a player by its ID.
 * 
 * @param  {string}     The ID of the player to search
 * @return {object}     The found player or FALSE in case it doesn't exists
 */
function getPlayerById(id) {
  var i;
  for (i = 0; i < players.length; i++) {
    if (players[i].id == id)
      return players[i];
  };
  
  return false;
};

http.listen(3000, function(){
  games.push(new Game(games.length + 1));
  console.log('listening on *:3000');
});

/*
Define the variables to use for the game
 */
//  var socket;     // Socket controller
//  var players;    // Array of connected players


/**
 * Function that initiates the configuration for the game.
 * 
 * @return {[type]}
 */
function init() {
  // Create an empty array to store players
  players = [];

  // Set up Socket.IO to listen on port 8120
  socket = io.listen(8120);

  console.log(socket);

  // Configure Socket.IO to using WebSockets
  socket.configure(function() {
    // Only use WebSockets
    socket.set("transports", ["websocket"]);

    // Restrict log output
    socket.set("log level", 2);
  });

  // Start listening for events
  setEventHandlers();
};


/*
Functions for game sessions controlling
 */

/**
 * Function that sets the listener for Socket.IO client connection.
 */
var setEventHandlers = function() {
  // Socket.IO
  socket.sockets.on("connection", onSocketConnection);
};

/**
 * Function called when a new socket connects with Socket.IO.
 * 
 * @param  {object}     The connected socket (client).
 */
function onSocketConnection(client) {
  
};

/*
// Player has moved
function onMovePlayer(data) {
  // Find player in array
  var movePlayer = getPlayerById(this.id);

  // Player not found
  if (!movePlayer) {
    console.log("Player not found: "+this.id);
    //  util.log("Player not found: "+this.id);
    return;
  };

  // Update player position
  movePlayer.setX(data.x);
  movePlayer.setY(data.y);

  // Broadcast updated position to connected socket clients
  this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
};
*/


/**************************************************
** RUN THE GAME
**************************************************/
//  init();