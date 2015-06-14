/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(playerId) {
  var id = playerId;
  var horseName = "";

  // Getters and setters
  var _getHorseName = function() {
    return horseName;
  };

  var _setHorseName = function(_horseName) {
    horseName = _horseName;
  };

  // Define which variables and methods can be accessed
  return {
    getHorseName: _getHorseName,
    setHorseName: _setHorseName,
    id: id
  }
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;