var Utils = function(){
  var _getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return {
    getRandomInt: _getRandomInt
  };
};

// Export the Utils class so you can use it in
// other files by using require("Utils").Utils
exports.Utils = new Utils();