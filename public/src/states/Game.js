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
  this.raceTrackHeight = 0;
  this.timerSpriteX = 0;
  this.questionGroup = null;
  this.questionTextBackground = null;
  this.questionTextObj = null;
  this.questionAnswersGroup = null;
  this.questionAnswers = [];
  this.questionTextStyle = null;
  this.answerTextStyle = null;
  this.correctAnswerGroup = null;
  this.correctAnswerText = null;
  this.correctAnswerSprite = null;
  this.blackCrystalCorrectSprite = null;
  this.wrongAnswerGroup = null;
  this.wrongAnswerText = null;
  this.wrongAnswerSprite = null;
  this.blackCrystalWrongSprite = null;
  this.finishGroup = null;
  this.finishText = null;
  this.finishSprite = null;
};

HorseRacer.Game.prototype.init = function(gamePlayers, pickedHorseKey, socket){
  var _me = this;
  this.gamePlayers = gamePlayers;
  this.playerHorseId = pickedHorseKey;
  this.socket = socket;

  this.socket.on("receive question", function(data){
    _me.receiveQuestion(data.question);
  });

  this.socket.on("move horse", function(data){
    _me.moveHorse(data.amount);
  });

  this.socket.on("move opponent", function(data){
    _me.moveOpponentHorse(data.horseId, data.amount);
  });

  this.socket.on("finish reached", function(data){
    _me.showFinalPosition(data.position);
  });

  this.socket.on("oponent finished", function(data){
    _me.showOponentPosition(data);
  });

};

HorseRacer.Game.prototype.create = function(){
  var _me = this;
  var initialXPos = this.game.width / 2 - 160;
  var initialYPos = 0;
  var trackHeight = 48;//64 - 16
  var horseHeight = 32;
  var raceTrackWidth = 320;
  this.raceTrackHeight = 256;
  this.timerSpriteX = this.game.world.width - 8;
  var userInteractionHeight = this.game.world.height - this.raceTrackHeight;
  var userInteractionMiddle = ((userInteractionHeight) / 2) + this.raceTrackHeight;

  // create the race tracks
  this.raceTracks = this.game.add.tileSprite(initialXPos,
    initialYPos, raceTrackWidth, this.raceTrackHeight, 'race_track');

  // create the horses in order of selection and fill the array of enemies
  this.horsesGroup = this.game.add.group(undefined, "horses");
  for (var i = 0; i < this.gamePlayers.length; i++) {
    var horse = this.game.add.sprite(initialXPos,
      (trackHeight * (i+1)) + (16*i) - horseHeight,
      'horse' + this.horseNames[this.gamePlayers[i].playerHorse - 1]);
    horse.trackLine = i+1;
    horse.horseId = this.gamePlayers[i].playerHorse;
    if(this.gamePlayers[i].playerHorse == this.playerHorseId){
      this.playerHorse = horse;
    }else{
      this.enemyHorses.push(horse);
    }
    this.horsesGroup.add(horse);
  };

  // define the style that will use the question text
  this.questionTextStyle = {
    fill: '#010101',
    font:'12pt Arial',
    wordWrap: true,
    wordWrapWidth: this.timerSpriteX,
    align: 'center'
  };

  this.answerTextStyle = {
    fill: '#FAFAFA',
    font:'12pt Arial',
    wordWrap: true,
    wordWrapWidth: this.timerSpriteX/2-2,
    align: 'center'
  };

  // create the group for the questions texts
  this.questionGroup = this.game.add.group(undefined, "question");

  // add to the game the Text object for the question text
  this.questionTextObj = this.game.make.text(this.timerSpriteX / 2,
    this.raceTrackHeight + 5,
    "Question. . .",
    this.questionTextStyle);
  this.questionTextObj.anchor.set(0.5, 0);

  // create the background for the question text
  this.questionTextBackground = new Phaser.Sprite(this.game, 0, this.raceTrackHeight);
  this.questionTextBackground.width = this.timerSpriteX;
  
  this.questionGroup.addChild(this.questionTextBackground);
  this.questionGroup.addChild(this.questionTextObj);

  // add to the game the four Text objects for the question answers
  this.questionAnswersGroup = this.game.add.group(undefined, "questionAnswers");
  for(var i=0; i<4; i++){
    // create the Text object for the answer
    var answerTextObj = this.game.make.text(0, 0,
      "Answer "+(i+1)+". . .",
      this.answerTextStyle);
    answerTextObj.anchor.set(0.5, 0.5);

    var answerBackground = new Phaser.Sprite(this.game, 0, 0);
    answerBackground.answerId = i+1;
    answerBackground.inputEnabled = true;
    answerBackground.input.useHandCursor = true;
    answerBackground.events.onInputDown.add(this.sendResponse, this);
    
    this.questionAnswersGroup.addChild(answerBackground);
    this.questionAnswersGroup.addChild(answerTextObj);
  }

  // create the bar for the timer
  this.timerSprite = this.game.add.sprite(this.timerSpriteX, this.raceTrackHeight, 'loading_progress');
  this.timerSprite.width = 8;
  this.timerSprite.height = this.game.world.height - this.raceTrackHeight; //  224px
  this.timerSprite.originalY = this.raceTrackHeight;

  // create the black crystal
  var blackCrystalBitmap = new Phaser.BitmapData(this.game, 'blackCrystal-background');
  blackCrystalBitmap.ctx.beginPath();
  blackCrystalBitmap.ctx.rect(0, 0, this.game.world.width, this.game.world.height);
  blackCrystalBitmap.ctx.fillStyle = "#0D0D0D";
  blackCrystalBitmap.ctx.fill();

  // create the group for correct answer
  this.correctAnswerGroup = this.game.add.group(undefined, "correctAnswerGroup");

  this.blackCrystalCorrectSprite = new Phaser.Sprite(this.game, 0, 0, blackCrystalBitmap);
  this.blackCrystalCorrectSprite.width = this.game.world.width;
  this.blackCrystalCorrectSprite.height = userInteractionHeight;
  this.blackCrystalCorrectSprite.x = this.game.world.width / 2;
  this.blackCrystalCorrectSprite.y = userInteractionMiddle;
  this.blackCrystalCorrectSprite.anchor.set(0.5, 0.5);
  this.blackCrystalCorrectSprite.alpha = 0.8;

  this.correctAnswerText = this.game.make.text(this.timerSpriteX / 2,
    userInteractionMiddle,
    "Correcto!",
    { fill: '#FAFAFA', font:'12pt Arial', align: 'center' });
  this.correctAnswerText.anchor.set(0.5, 0.5);

  var correctAnswerBitmap = new Phaser.BitmapData(this.game, 'correctAnswer-background');
  correctAnswerBitmap.ctx.beginPath();
  correctAnswerBitmap.ctx.rect(0, 0, this.game.world.width, this.game.world.height);
  correctAnswerBitmap.ctx.fillStyle = "#2ABB9B";
  correctAnswerBitmap.ctx.fill();
  this.correctAnswerSprite = new Phaser.Sprite(this.game, 0, 0, correctAnswerBitmap);
  this.correctAnswerSprite.width = this.game.world.width;
  this.correctAnswerSprite.height = 150;
  this.correctAnswerSprite.x = this.game.world.width / 2;
  this.correctAnswerSprite.y = userInteractionMiddle;
  this.correctAnswerSprite.anchor.set(0.5, 0.5);

  this.correctAnswerGroup.addChild(this.blackCrystalCorrectSprite);
  this.correctAnswerGroup.addChild(this.correctAnswerSprite);
  this.correctAnswerGroup.addChild(this.correctAnswerText);
  this.correctAnswerGroup.visible = false;

  // create the Sprite for wrong answer
  this.wrongAnswerGroup = this.game.add.group(undefined, "wrongAnswerGroup");

  this.blackCrystalWrongSprite = new Phaser.Sprite(this.game, 0, 0, blackCrystalBitmap);
  this.blackCrystalWrongSprite.width = this.game.world.width;
  this.blackCrystalWrongSprite.height = userInteractionHeight;
  this.blackCrystalWrongSprite.x = this.game.world.width / 2;
  this.blackCrystalWrongSprite.y = userInteractionMiddle;
  this.blackCrystalWrongSprite.anchor.set(0.5, 0.5);
  this.blackCrystalWrongSprite.alpha = 0.8;

  this.wrongAnswerText = this.game.make.text(this.timerSpriteX / 2,
    userInteractionMiddle,
    "Incorrecto!",
    { fill: '#FAFAFA', font:'12pt Arial', align: 'center' });
  this.wrongAnswerText.anchor.set(0.5, 0.5);

  var wrongAnswerBitmap = new Phaser.BitmapData(this.game, 'wrongAnswer-background');
  wrongAnswerBitmap.ctx.beginPath();
  wrongAnswerBitmap.ctx.rect(0, 0, this.game.world.width, this.game.world.height);
  wrongAnswerBitmap.ctx.fillStyle = "#EF5A34";
  wrongAnswerBitmap.ctx.fill();
  this.wrongAnswerSprite = new Phaser.Sprite(this.game, 0, 0, wrongAnswerBitmap);
  this.wrongAnswerSprite.width = this.game.world.width;
  this.wrongAnswerSprite.height = 150;
  this.wrongAnswerSprite.x = this.game.world.width / 2;
  this.wrongAnswerSprite.y = userInteractionMiddle;
  this.wrongAnswerSprite.anchor.set(0.5, 0.5);

  this.wrongAnswerGroup.addChild(this.blackCrystalWrongSprite);
  this.wrongAnswerGroup.addChild(this.wrongAnswerSprite);
  this.wrongAnswerGroup.addChild(this.wrongAnswerText);
  this.wrongAnswerGroup.visible = false;

  // create the group to show when the player reaches the finish line
  this.finishGroup = this.game.add.group(undefined, "finishGroup");

  this.finishText = this.game.make.text(this.game.world.width / 2,
    userInteractionMiddle,
    "Llegaste Primero!",
    { fill: '#ECF0F1', font:'18pt Arial', align: 'center' });
  this.finishText.anchor.set(0.5, 0.5);

  var finishBitmap = new Phaser.BitmapData(this.game, 'finish-background');
  finishBitmap.ctx.beginPath();
  finishBitmap.ctx.rect(0, 0, this.game.world.width, this.game.world.height);
  finishBitmap.ctx.fillStyle = "#FFFFFF";
  finishBitmap.ctx.fill();
  this.finishSprite = new Phaser.Sprite(this.game, 0, 0, finishBitmap);
  this.finishSprite.width = this.game.world.width;
  this.finishSprite.height = userInteractionHeight;
  this.finishSprite.x = this.game.world.width / 2;
  this.finishSprite.y = userInteractionMiddle;
  this.finishSprite.anchor.set(0.5, 0.5);

  this.finishGroup.addChild(this.finishSprite);
  this.finishGroup.addChild(this.finishText);
  this.finishGroup.visible = false;

  // create and start the question timer
  this.game.time.advancedTiming = true;
  this.questionTimer = this.game.time.create(false);
  this.questionTimer.loop(Phaser.Timer.SECOND, this.secondPassed, this);

  // notify to the server that I am ready for receiving a question
  this.socket.emit("ready to play");
};

/**
 * Method that makes the player's horse move.
 * 
 */
HorseRacer.Game.prototype.sendResponse = function(sourceObject){
  if(this.horsesRunning === true){
    return;
  }

  // update the state of the player's horse
  this.horsesRunning = true;

  // disable the buttons for sending response
  for(var i=0; i<4; i++){
    var answerSprite = this.questionAnswersGroup.getChildAt(i*2);
    answerSprite.inputEnabled = false;
    answerSprite.input.useHandCursor = true;
  }


  // notify to the server the response of the player and the time it takes to
  // response it
  var _responseTime = (this.responseTimeFinished === true) ? null : this.questionTimer.ms;
  var _response = (this.responseTimeFinished === true) ? null : sourceObject.answerId;
  this.socket.emit("answer question", {response: _response, responseTime: _responseTime});

  // restore defaults
  this.responseTimeFinished = false;

  // stop the timer for answering the question
  this.questionTimer.stop(false);
};

/**
 * Method that moves the horse of the player.
 * 
 * @param  {int} movementAmount     The distance the player's horse will move
 */
HorseRacer.Game.prototype.moveHorse = function(movementAmount){
  if(this.finishGroup.visible == true){
    this.horseMoved();
    this.socket.emit("horse moved");
    return;
  }

  if(!movementAmount){
    this.wrongAnswerGroup.visible = true;
  }else{
    this.correctAnswerGroup.visible = true;
  }

  // move the player's horse
  this.game.add.tween(this.playerHorse).to(
    {x: this.playerHorse.x + movementAmount},
    1000,
    Phaser.Easing.Linear.None,
    true,
    0,
    0,
    false
  ).onComplete.add(function(){
    this.horseMoved();
    this.socket.emit("horse moved");
  }, this);
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
  // if the time has ended, make the player's horse move
  if(this.timerSprite.y + 22.4 >= this.game.world.height){
    if(this.horsesRunning === false){
      // indicate that the player has not responded the answer
      this.responseTimeFinished = true;
      this.sendResponse();
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
  }
};

/**
 * Method that draws on screen the question received by the server and starts
 * the question timer.
 * 
 * @param  {object} questionObj      The object with the question's data
 */
HorseRacer.Game.prototype.receiveQuestion = function(questionObj){
  if(this.finishGroup.visible == true){
    this.horsesRunning = false;
    this.responseTimeFinished = true;
    this.sendResponse();
    return;
  }

  this.wrongAnswerGroup.visible = false;
  this.correctAnswerGroup.visible = false;

  // get the data of the question and draws it on screen
  this.questionTextObj.setText(questionObj.q);
  this.questionTextBackground.texture.destroy(true);
  var questionTextBackgroundBit = new Phaser.BitmapData(this.game, 'questionText-background');
  questionTextBackgroundBit.ctx.beginPath();
  questionTextBackgroundBit.ctx.rect(0, 0, this.timerSpriteX, this.questionTextObj.bottom - this.raceTrackHeight);
  questionTextBackgroundBit.ctx.fillStyle = "#ffec4a";
  questionTextBackgroundBit.ctx.fill();
  this.questionTextBackground.loadTexture(questionTextBackgroundBit);

  var answersSpace = this.game.world.height - this.questionTextObj.bottom;
  var firstRowAnswersPos = answersSpace/4;
  var secondRowAnswersPos = firstRowAnswersPos + firstRowAnswersPos*2;
  var answerYPos = [
    firstRowAnswersPos, firstRowAnswersPos,
    secondRowAnswersPos, secondRowAnswersPos
  ];
  var answerIsLeft = true;
  for(var i=0; i<4; i++){
    var answerXPos = this.timerSpriteX/4;
    if(answerIsLeft == false){
      answerXPos += answerXPos * 2;
    }

    var answerTextObj = this.questionAnswersGroup.getChildAt((i*2)+1);
    answerTextObj.setText(questionObj.o.shift());
    answerTextObj.x = answerXPos;
    answerTextObj.y = this.questionTextObj.bottom + answerYPos[i];
    var answerSprite = this.questionAnswersGroup.getChildAt(i*2);

    // create the background for the answer
    answerSprite.texture.destroy(true);
    var answerBackgroundBit = new Phaser.BitmapData(this.game, 'answer'+(i+1)+'-background');
    answerBackgroundBit.ctx.beginPath();
    answerBackgroundBit.ctx.rect(0, 0, this.timerSpriteX/2, answersSpace/2);
    answerBackgroundBit.ctx.fillStyle = "#237dbc";
    answerBackgroundBit.ctx.fill();
    answerBackgroundBit.ctx.strokeStyle = "#ffec4a";
    answerBackgroundBit.ctx.stroke();
    answerSprite.loadTexture(answerBackgroundBit);
    answerSprite.x = answerTextObj.x - (this.timerSpriteX/4);
    answerSprite.y = answerTextObj.y - (answersSpace/4);
    answerSprite.inputEnabled = true;
    answerSprite.input.useHandCursor = true;

    answerIsLeft = !answerIsLeft;
  }

  // start the timer for asnwering the question
  this.questionTimer.start();
};

HorseRacer.Game.prototype.showFinalPosition = function(position){
  this.finishSprite.tint = (position.indexOf("burro") != -1) ? 0xE74C3C : 0x2980B9;
  this.finishText.setText(position + "!");
  this.finishGroup.visible = true;
  this.finishGroup.update();
};

HorseRacer.Game.prototype.showOponentPosition = function(data){
  var opId = data.horseId;
  var opPos = data.position;
  opPos = opPos.replace("Llegaste ", "");
  opPos = opPos.replace("Eres el", "El");
  var lineHeight = 64;
  // console.log("OP ", opId, opPos.replace("Llegaste ", ""));
  this.horsesGroup.forEach(function(spriteObj, id, pos){
    if(spriteObj.horseId == id){
      var opFinishGroup = this.game.add.group(undefined, "op" + id + "FinishGroup");
      var finishText = this.game.make.text(this.game.world.width/2,
        (lineHeight * (spriteObj.trackLine - 1)) + (lineHeight/2),
        pos,
        { fill: '#FAFAFA', font:'14pt Arial', align: 'center' });
      finishText.anchor.set(0.5, 0.5);

      var finishBitmap = new Phaser.BitmapData(this.game, "op" + id + 'finish-background');
      finishBitmap.ctx.beginPath();
      finishBitmap.ctx.rect(0, 0, this.game.world.width, this.game.world.height);
      finishBitmap.ctx.fillStyle = "#313131";
      finishBitmap.ctx.fill();
      var finishSprite = new Phaser.Sprite(this.game, 0, 0, finishBitmap);
      finishSprite.width = this.game.world.width;
      finishSprite.height = lineHeight;
      finishSprite.x = 0;
      finishSprite.y = lineHeight * (spriteObj.trackLine - 1);

      opFinishGroup.addChild(finishSprite);
      opFinishGroup.addChild(finishText);
    }
  }, this, true, opId, opPos);
};
