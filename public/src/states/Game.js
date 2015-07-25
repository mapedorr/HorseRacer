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
  this.questionGroup = null;
  this.questionTextBackground = null;
  this.questionText = null;
  this.questionAnswersGroup = null;
  this.questionAnswers = ["Quicksilver el man rápido", "Magneto el del futuro", "Tormenta la vieja de los rayos", "Wolverine el que se regenera"];
  this.questionTextStyle = null
  this.answerTextStyle = null
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
  var timerSpriteX = this.game.world.width - 8;
  var answerIsLeft = true;

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
  // this.runButton = this.game.add.button(this.world.width / 2, 
  //   this.world.height - 128, 
  //   'runButton', 
  //   this.responseAnswer, 
  //   this, 
  //   1,0,2);
  // this.runButton.scale.set(0.5, 0.5);
  // this.runButton.anchor.set(0.5, 0);
  // this.runButton.input.useHandCursor = true;
  // this.runButton.originalY = this.world.height - 128;
  // this.runButton.y += 1000;

  // define the style that will use the question text
  this.questionTextStyle = {
    fill: '#010101',
    font:'12pt Arial',
    wordWrap: true,
    wordWrapWidth: timerSpriteX,
    align: 'center'
  };

  this.answerTextStyle = {
    fill: '#FAFAFA',
    font:'12pt Arial',
    wordWrap: true,
    wordWrapWidth: timerSpriteX/2-2,
    align: 'center'
  };

  // create the group for the questions texts
  this.questionGroup = this.game.add.group(undefined, "question");

  // add to the game the Text object for the question text
  this.questionText = this.game.make.text(timerSpriteX / 2,
    raceTrackHeight + 5,
    "¿Cuál es el nombre del personaje que hace John Travolta en Pulp Fiction?",
    this.questionTextStyle);
  this.questionText.anchor.set(0.5, 0);

  // create the background for the question text
  var questionTextBackgroundBit = new Phaser.BitmapData(this.game, 'questionText-background');
  questionTextBackgroundBit.ctx.beginPath();
  questionTextBackgroundBit.ctx.rect(0, 0, timerSpriteX, this.questionText.bottom - raceTrackHeight);
  questionTextBackgroundBit.ctx.fillStyle = "#ffec4a";
  questionTextBackgroundBit.ctx.fill();
  this.questionTextBackground = new Phaser.Sprite(this.game, 0, raceTrackHeight, questionTextBackgroundBit);
  this.questionTextBackground.width = timerSpriteX;
  
  this.questionGroup.addChild(this.questionTextBackground);
  this.questionGroup.addChild(this.questionText);

  // add to the game the four Text objects for the question answers
  this.questionAnswersGroup = this.game.add.group(undefined, "questionAnswers");
  var answersSpace = this.game.world.height - this.questionText.bottom;
  var firstRowAnswersPos = answersSpace/4;
  var secondRowAnswersPos = firstRowAnswersPos + firstRowAnswersPos*2;
  var answerYPos = [
    firstRowAnswersPos, firstRowAnswersPos,
    secondRowAnswersPos, secondRowAnswersPos
  ];
  for(var i=0; i<this.questionAnswers.length; i++){
    var answerXPos = timerSpriteX/4;
    if(answerIsLeft == false){
      answerXPos += answerXPos * 2;
    }

    // create the Text object for the answer
    var answerTextObj = this.game.make.text(answerXPos,
      this.questionText.bottom + answerYPos[i],
      this.questionAnswers[i],
      this.answerTextStyle);
    answerTextObj.anchor.set(0.5, 0.5);

    // create the background for the answer
    var answerBackgroundBit = new Phaser.BitmapData(this.game, 'answer'+(i+1)+'-background');
    answerBackgroundBit.ctx.beginPath();
    answerBackgroundBit.ctx.rect(0, 0, timerSpriteX/2, answersSpace/2);
    answerBackgroundBit.ctx.fillStyle = "#237dbc";
    answerBackgroundBit.ctx.fill();
    answerBackgroundBit.ctx.strokeStyle = "#ffec4a";
    answerBackgroundBit.ctx.stroke();
    var answerBackground = new Phaser.Sprite(this.game, answerTextObj.world.x, answerTextObj.world.y, answerBackgroundBit);
    answerBackground.answerId = i+1;
    answerBackground.x -= timerSpriteX/4;
    answerBackground.y -= answersSpace/4;
    answerBackground.inputEnabled = true;
    answerBackground.input.useHandCursor = true;
    answerBackground.events.onInputDown.add(this.responseAnswer, this, 0, i+1);
    
    this.questionAnswersGroup.addChild(answerBackground);
    this.questionAnswersGroup.addChild(answerTextObj);

    answerIsLeft = !answerIsLeft;
  }

  // create the bar for the timer
  this.timerSprite = this.game.add.sprite(timerSpriteX, raceTrackHeight, 'loading_progress');
  this.timerSprite.width = 8;
  this.timerSprite.height = this.game.world.height - raceTrackHeight; //  224px
  this.timerSprite.originalY = raceTrackHeight;

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
HorseRacer.Game.prototype.responseAnswer = function(sourceObject){
  console.log("Answer to send: ", sourceObject.answerId);
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