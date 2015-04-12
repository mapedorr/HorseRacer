window.onload = function () {
  var height = 480;
  var width = 320;
  // var game = new Phaser.Game(height*4/3, height, Phaser.AUTO);
  var game = new Phaser.Game(width, height, Phaser.AUTO);
  
  game.state.add('Boot', HorseRacer.Boot);
  game.state.add('Preloader', HorseRacer.Preloader);
  game.state.add('StartScreen', HorseRacer.StartScreen);
  game.state.add('MainMenu', HorseRacer.MainMenu);
  game.state.add('Game', HorseRacer.Game);

  game.state.start('Boot');
};