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
  this.movedHorses = 0;

  this.runButton = null;
};

HorseRacer.Game.prototype.init = function(gamePlayers, pickedHorseKey, socket){
  var _me = this;
  this.gamePlayers = gamePlayers;
  this.playerHorseId = pickedHorseKey;
  this.socket = socket;

  //  this.socket.on("player connected", onPlayerConnected);
  this.socket.on("move opponent", function(data){
    _me.moveOpponentHorse(data.horseId);
  });
};

HorseRacer.Game.prototype.preload = function(){

};

HorseRacer.Game.prototype.create = function(){
  var _me = this;
  var initialXPos = this.game.width / 2 - 160;
  var initialYPos = 0;
  var trackHeight = 48;//64 - 16
  var horseHeight = 32;
  var raceTrackWidth = 320;
  var raceTrackHeight = 256;

  //Draw the race tracks
  this.raceTracks = this.game.add.tileSprite(initialXPos, initialYPos, raceTrackWidth, raceTrackHeight, 'race_track');

  //Add the horses in order of selection
  this.horsesGroup = this.game.add.group(undefined, "horses");

  for (var i = 0; i < this.gamePlayers.length; i++) {
    var horse = this.game.add.sprite(initialXPos, (trackHeight * (i+1)) + (16*i) - horseHeight, 'horse' + this.horseNames[this.gamePlayers[i].playerHorse - 1]);
    horse.horseId = this.gamePlayers[i].playerHorse;
    if(this.gamePlayers[i].playerHorse == this.playerHorseId){
      this.playerHorse = horse;
    }else{
      this.enemyHorses.push(horse);
    }
    this.horsesGroup.add(horse);
  };

  //Add the button for making the horse run
  this.runButton = this.game.add.button(this.world.width / 2, 
    this.world.height - 128, 
    'runButton', 
    this.runHorse, 
    this, 
    1,0,2);
  this.runButton.scale.set(0.5, 0.5);
  this.runButton.anchor.set(0.5, 0);
  this.runButton.input.useHandCursor = true;
  this.runButton.originalY = this.world.height - 128;
  this.runButton.y += 1000;

  //Add the bar for the timer
  var timerSpriteX = this.game.world.width - 16;
  var timerSpriteY = raceTrackHeight;
  this.timerSprite = this.game.add.sprite(timerSpriteX, timerSpriteY, 'loading_progress');
  this.timerSprite.width = 16;
  this.timerSprite.height = this.game.world.height - raceTrackHeight; //  224px
  this.timerSprite.tint = 0x5BA581;
  this.timerSprite.originalY = timerSpriteY;

  //Add and start the question timer
  //  this.questionTimer = this.questionTime; //10 secs
  this.game.time.advancedTiming = true;
  this.questionTimer = this.game.time.create(false);
  this.questionTimer.loop(Phaser.Timer.SECOND, this.secondPassed, this);
  this.questionTimer.start();
};

HorseRacer.Game.prototype.update = function(){
};

HorseRacer.Game.prototype.runHorse = function(){
  if(this.horsesRunning === true){
    return;
  }

  var _me = this;
  this.questionTimer.stop(false);
  this.runButton.y += 1000;

  //Notify to the server that my horse is going to move
  this.socket.emit("move horse", {horseId: this.playerHorseId});

  //Move the player's horse
  this.game.add.tween(this.playerHorse).to(
    {x: this.playerHorse.x + 15},
    1000,
    Phaser.Easing.Linear.None,
    true,
    0,
    0,
    false
  ).onComplete.add(this.horseMoved, this);

  /*this.enemyHorses.forEach(function(horseSprite){
    _me.game.add.tween(horseSprite).to(
      {x: horseSprite.x + Math.ceil(Math.random() * 15)},
      1000,
      Phaser.Easing.Linear.None,
      true,
      0,
      0,
      false
    ).onComplete.add(_me.horseMoved, _me);
  });*/

  this.horsesRunning = true;
};

HorseRacer.Game.prototype.moveOpponentHorse = function(horseId){
  for (var i = 0; i < this.enemyHorses.length; i++) {
    if(this.enemyHorses[i].horseId == horseId){
      this.game.add.tween(this.enemyHorses[i]).to(
        {x: this.enemyHorses[i].x + 15},
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

HorseRacer.Game.prototype.secondPassed = function(){

  this.runButton.y = this.runButton.originalY;

  if(this.timerSprite.y + 22.4 >= this.game.world.height){
    if(this.horsesRunning === false){
      this.runHorse();
    }
    this.questionTimer.stop(false);
    return;
  }

  //Each second reduces the height of the timer sprite
  this.game.add.tween(this.timerSprite).to(
    {y: this.timerSprite.y + 22.4},//  224 / 10
    950,
    Phaser.Easing.Linear.None,
    true,
    0,
    0,
    false
  );
};

HorseRacer.Game.prototype.horseMoved = function(){
  this.movedHorses++;

  if(this.movedHorses >= 4){
    this.movedHorses = 0;
    this.timerSprite.y = this.timerSprite.originalY;
    this.horsesRunning = false;
    this.questionTimer.start();
  }
};