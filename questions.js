var Questions = function(){
  var _gameQuestions = [
    {
      question: "¿Quién es el director de la película Memento?",
      response: "Christopher Nolan",
      options: [
        "Guisepe Verdi",
        "James Cameron",
        "Henry Dickson"
      ]
    },
    {
      question: "¿Cuántas películas de Batman dirigió Tim Burton?",
      response: "3",
      options: [
        "8",
        "9",
        "4"
      ]
    },
    {
      question: "¿De qué color es el delorean de \"Volver al futuro\"?",
      response: "Gris",
      options: [
        "Rojo",
        "Azul",
        "Negro"
      ]
    },
    {
      question: "¿Cuál es el nombre del niño que destruye juguetes en Toy Story?",
      response: "Sid",
      options: [
        "Peter",
        "Fred",
        "Sully"
      ]
    },
    {
      question: "¿Cuántos años duró en coma Beatrix Kiddo en Kill Bill?",
      response: "5",
      options: [
        "8",
        "6",
        "1"
      ]
    },
    {
      question: "¿Cuál es el nombre del mono sabio de El Rey León?",
      response: "Rafiki",
      options: [
        "Rafa",
        "Racon",
        "Ruquirri"
      ]
    },
    {
      question: "¿Quién hizo la voz en inglés de Mike Wazowski en Monsters Inc?",
      response: "Billy Crystal",
      options: [
        "Tim Mayers",
        "Sandra Bullock",
        "Richard Gere"
      ]
    },
    {
      question: "El Halcón Milenario es comandado por el capitán...",
      response: "Solo",
      options: [
        "Centella",
        "Sónico",
        "Costas"
      ]
    },
    {
      question: "¿De qué color es la espada de luz de Darth Vader?",
      response: "Roja",
      options: [
        "Verde",
        "Azul",
        "Negra"
      ]
    },
    {
      question: "¿Cuál es el nombre del personaje que hace John Travolta en Pulp Fiction?",
      response: "Vincent Vega",
      options: [
        "Ibzen Mega",
        "Christian Vega",
        "Tristan Leena"
      ]
    },
    {
      question: "¿Quién está de primero en la \"death list five\" en Kill Bill?",
      response: "O-Ren Ishii",
      options: [
        "Bill",
        "Elle Driver",
        "Budd"
      ]
    },
    {
      question: "¿En qué ciudad se desarrolla Ratatouille?",
      response: "París",
      options: [
        "Roma",
        "Barcelona",
        "Mérida"
      ]
    },
    {
      question: "¿Con cuántos dados se juega Jumanji?",
      response: "Dos",
      options: [
        "Uno",
        "Seis",
        "Sin dados"
      ]
    },
    {
      question: "¿Cuál es el nombre del padre de Matilda?",
      response: "Harry",
      options: [
        "Herny",
        "Larry",
        "Darryl"
      ]
    },
    {
      question: "¿Quién ayuda a magneto a salir de la cárcel en Días del futuro pasado?",
      response: "Quicksilver",
      options: [
        "Magneto del futuro",
        "Tormenta",
        "Wolverine"
      ]
    }
    // {
    //   question: "",
    //   response: "",
    //   options: [
    //     "",
    //     "",
    //     ""
    //   ]
    // }
  ];
  var _usedQuestions = [];

  var _getQuestions = function(){
    return _gameQuestions;
  };

  var _setQuestions = function(_newQuestions){
    _gameQuestions = _newQuestions;
  };

  var _pushAsUsedQuestion = function(question){
    _usedQuestions.push(question);
  };

  return {
    getQuestions: _getQuestions,
    setQuestions: _setQuestions,
    pushAsUsedQUestion: _pushAsUsedQuestion
  };

};

// Export the Questions class so you can use it in
// other files by using require("Questions").Questions
exports.Questions = Questions;