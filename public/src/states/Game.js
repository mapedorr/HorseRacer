var HorseRacer = HorseRacer || {};

HorseRacer.Game = function(game){
  this.playerHorseId = null;
  this.playerHorse = null;
  this.socket = null;
  this.gamePlayers = null;

  this.horseNames = ["Amateur", "Rocky", "Yegua", "Viejo"];
  this.enemyHorses = [];
  this.horsesGroup = null;
  this.raceTracks = null;
  this.timerSprite = null;
  this.questionTimer = 0;
  this.questionTime = 10000;
  this.horsesRunning = false;
  this.responseTimeFinished = false;
  this.movedHorses = 0;

  this.runButton = null;
};

HorseRacer.Game.prototype.init = function(gamePlayers, pickedHorseKey, socket){
  var _me = this;
  this.gamePlayers = gamePlayers;
  this.playerHorseId = pickedHorseKey;
  this.socket = socket;

  this.socket.on("move horse", function(data){
    _me.moveHorse(data.amount);
  });

  this.socket.on("move opponent", function(data){
    _me.moveOpponentHorse(data.horseId, data.amount);
  });

};

HorseRacer.Game.prototype.create = function(){
  var _me = this;
  var initialXPos = this.game.width / 2 - 160;
  var initialYPos = 0;
  var trackHeight = 48;//64 - 16
  var horseHeight = 32;
  var raceTrackWidth = 320;
  var raceTrackHeight = 256;

  // create the race tracks
  this.raceTracks = this.game.add.tileSprite(initialXPos,
    initialYPos, raceTrackWidth, raceTrackHeight, 'race_track');

  // create the horses in order of selection and fill the array of enemies
  this.horsesGroup = this.game.add.group(undefined, "horses");
  for (var i = 0; i < this.gamePlayers.length; i++) {
    var horse = this.game.add.sprite(initialXPos,
      (trackHeight * (i+1)) + (16*i) - horseHeight,
      'horse' + this.horseNames[this.gamePlayers[i].playerHorse - 1]);
    horse.horseId = this.gamePlayers[i].playerHorse;
    if(this.gamePlayers[i].playerHorse == this.playerHorseId){
      this.playerHorse = horse;
    }else{
      this.enemyHorses.push(horse);
    }
    this.horsesGroup.add(horse);
  };

  // create the button for making the horse run (tests)
  this.runButton = this.game.add.button(this.world.width / 2, 
    this.world.height - 128, 
    'runButton', 
    this.responseAnswer, 
    this, 
    1,0,2);
  this.runButton.scale.set(0.5, 0.5);
  this.runButton.anchor.set(0.5, 0);
  this.runButton.input.useHandCursor = true;
  this.runButton.originalY = this.world.height - 128;
  this.runButton.y += 1000;

  // create the bar for the timer
  var timerSpriteX = this.game.world.width - 16;
  var timerSpriteY = raceTrackHeight;
  this.timerSprite = this.game.add.sprite(timerSpriteX, timerSpriteY, 'loading_progress');
  this.timerSprite.width = 16;
  this.timerSprite.height = this.game.world.height - raceTrackHeight; //  224px
  this.timerSprite.originalY = timerSpriteY;

  // create and start the question timer
  this.game.time.advancedTiming = true;
  this.questionTimer = this.game.time.create(false);
  this.questionTimer.loop(Phaser.Timer.SECOND, this.secondPassed, this);
  this.questionTimer.start();
};

/**
 * Method that makes the player's horse move.
 * 
 */
HorseRacer.Game.prototype.responseAnswer = function(){
  if(this.horsesRunning === true){
    return;
  }

  // update the state of the player's horse
  this.horsesRunning = true;

  // notify to the server the response of the player and the time it takes to
  // response it
  var _responseTime = (this.responseTimeFinished === true) ? null : this.questionTimer.ms;
  this.socket.emit("answer question", {responseTime: _responseTime});

  // restore defaults
  this.responseTimeFinished = false;

  // stop the timer for answering the question
  this.questionTimer.stop(false);

  // hide the button for making the player's horse move
  this.runButton.y += 1000;
};

/**
 * Method that moves the horse of the player.
 * 
 * @param  {int} movementAmount     The distance the player's horse will move
 */
HorseRacer.Game.prototype.moveHorse = function(movementAmount){
  // move the player's horse
  this.game.add.tween(this.playerHorse).to(
    {x: this.playerHorse.x + movementAmount},
    1000,
    Phaser.Easing.Linear.None,
    true,
    0,
    0,
    false
  ).onComplete.add(this.horseMoved, this);
};

/**
 * Method that moves the horse identified with the received parameter.
 * 
 * @param  {string} horseId     The ID of the enemy horse to move.
 * @param  {int} horseId        The distance the enemy horse will move.
 */
HorseRacer.Game.prototype.moveOpponentHorse = function(horseId, movementAmount){
  for (var i = 0; i < this.enemyHorses.length; i++) {
    if(this.enemyHorses[i].horseId == horseId){
      this.game.add.tween(this.enemyHorses[i]).to(
        {x: this.enemyHorses[i].x + movementAmount},
        1000,
        Phaser.Easing.Linear.None,
        true,
        0,
        0,
        false
      ).onComplete.add(this.horseMoved, this);
      break;
    }
  };
};

/**
 * Method that make the player's horse move when the time for answering has ended.
 * 
 */
HorseRacer.Game.prototype.secondPassed = function(){
  // put the run button on its original position
  this.runButton.y = this.runButton.originalY;

  // if the time has ended, make the player's horse move
  if(this.timerSprite.y + 22.4 >= this.game.world.height){
    if(this.horsesRunning === false){
      // indicate that the player has not responded the answer
      this.responseTimeFinished = true;
      this.responseAnswer();
    }
    this.questionTimer.stop(false);
    return;
  }

  // each second reduces the height of the timer sprite
  this.game.add.tween(this.timerSprite).to(
    {y: this.timerSprite.y + 22.4},//  224/10
    950,
    Phaser.Easing.Linear.None,
    true,
    0,
    0,
    false
  );
};

/**
 * Method that verifies if all the players have moved for activating the run button.
 * 
 */
HorseRacer.Game.prototype.horseMoved = function(){
  this.movedHorses++;

  // activate the run button and start the timer after all the players in
  // the match have moved
  if(this.movedHorses >= this.gamePlayers.length){
    this.movedHorses = 0;
    this.timerSprite.y = this.timerSprite.originalY;
    this.horsesRunning = false;
    this.questionTimer.start();
  }
};