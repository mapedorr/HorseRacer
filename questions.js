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
    },
    {
      question: "En La Estrategia del Caracol, ¿cuál era el apellido del Perro?",
      response: "Romero",
      options: [
        "López",
        "Carrero",
        "Ramírez"
      ]
    },
    {
      question: "¿Cuál es el nombre del protagonista de El Club de la Pelea?",
      response: "Edward Norton",
      options: [
        "Johny Deep",
        "Brad Pitt",
        "Michael Douglas"
      ]
    },
    {
      question: "¿Cuál es el nombre del general romano que interpreta Russell Crowe en Gladiador?",
      response: "Máximo",
      options: [
        "Perseo",
        "Octavio",
        "Quinto"
      ]
    },
    {
      question: "¿Cómo se llama el pequeño robot que en Wall-E está obsesionado con la limpieza?",
      response: "Mo",
      options: [
        "No",
        "Me",
        "Mou"
      ]
    },
    {
      question: "En Ratatouille, ¿cuál es la famosa frase del chef Gusteau?",
      response: "Cualquiera puede cocinar",
      options: [
        "Todos pueden cocinar",
        "Nadie puede cocinar",
        "Todos cocinan rico"
      ]
    },
    {
      question: "¿Cuál es el arma que usa El Oso, de Bastardos sin Gloria, para asesinar Nazis?",
      response: "Un bate",
      options: [
        "Un hacha",
        "Una espada",
        "Un rifle"
      ]
    },
    {
      question: "En Kill Bill, ¿cuál es el órgano que el maestro Pai Mei le quita a Elle?",
      response: "El ojo derecho",
      options: [
        "El ojo izquierdo",
        "Un diente",
        "La oreja derecha"
      ]
    },
    {
      question: "¿Cuál es la ciudad en la que se desarrolla la película Match Point, de Woody Allen?",
      response: "Londres",
      options: [
        "París",
        "Nueva York",
        "Liverpool"
      ]
    },
    {
      question: "¿En El Padrino, cuál es la razón por la que don Vito lleva el apellido Corleone?",
      response: "Es su ciudad de origen",
      options: [
        "Es el apellido materno",
        "Es el apellido paterno",
        "Es un apodo de la cárcel"
      ]
    },
    {
      question: "¿Cuál de las siguientes películas orientales fue producida por Quentin Tarantino?",
      response: "Héroe",
      options: [
        "La casa de las dagas voladoras",
        "El último samurai",
        "El tigre y el dragón"
      ]
    },
    {
      question: "En la película Sunshine (Alerta solar), ¿cuál es el planeta donde se encuentra el Ícaro I?",
      response: "Mercurio",
      options: [
        "Marte",
        "Venus",
        "La Tierra"
      ]
    },
    {
      question: "En Kill Bill, ¿cuál es el arma que utiliza Beatrix para asesinar a Bill?",
      response: "Ninguna",
      options: [
        "Un veneno",
        "Una daga",
        "Un revólver"
      ]
    },
    {
      question: "En Matrix, ¿cuál es el nombre de Neo?",
      response: "Thomas Anderson",
      options: [
        "Thomas Smith",
        "Smith Douglas",
        "Andrew Anderson"
      ]
    },
    {
      question: "¿Cuál es el actor que representa a Michael Corleone, en El Padrino?",
      response: "Al Pacino",
      options: [
        "Danny de Vitto",
        "Marlon Brando",
        "Robert De Niro"
      ]
    },
    {
      question: "¿Cuál es el nombre del director de Apocalypse Now?",
      response: "Francis Ford Coppola",
      options: [
        "Aldous Huxley",
        "Steven Spielberg",
        "Roman Polanski"
      ]
    },
    {
      question: "En El Club de la Pelea, ¿cómo se libera el protagonista de Tyler Durden?",
      response: "Pegándose un tiro",
      options: [
        "Pidiéndole que se vaya",
        "Abandonándolo",
        "Medicándose"
      ]
    },
    {
      question: "En Pulp Fiction, ¿a qué se debe la crisis que sufre Mya Wallace?",
      response: "Aspira heroína",
      options: [
        "Un ataque de nervios",
        "No se bañó",
        "Se inyectó jarabe"
      ]
    },
    {
      question: "¿Cuál es la prenda que, según Edna Moda (Los Increíbles), nunca debe llevar un superhéroe?",
      response: "La capa",
      options: [
        "El casco",
        "Las hombreras",
        "Los calsoncillos por fuera"
      ]
    },
    {
      question: "En la saga Star Wars, ¿qué relación tienen entre sí Luke Skywalker y la princesa Leia?",
      response: "Hermanos",
      options: [
        "Primos",
        "Amantes",
        "Madre e hijo"
      ]
    },
    {
      question: "En El Padrino I, don Vito llama severamente la atención a su hijo Sonny debido a que:",
      response: "Dijo lo que pensaba",
      options: [
        "Se robó un arma",
        "Se fue de putas",
        "Pagó sus deudas"
      ]
    },
    {
      question: "En Big Fish, Edward Bloom recorre un bosque embrujado y llega a un pueblo llamado:",
      response: "Spectre",
      options: [
        "Stari",
        "Usme",
        "Jackson, Alabama"
      ]
    },
    {
      question: "\"La familia es como un plato de lentejas… siempre te encuentras una negra\" corresponde a:",
      response: "El Padrino",
      options: [
        "La familia de mi novia",
        "Padre de familia",
        "Carros de fuego"
      ]
    },
    {
      question: "La película en la que fue conocida por primera vez Natalie Portman es:",
      response: "El perfecto asesino",
      options: [
        "El cisne negro",
        "Star Wars",
        "Closer"
      ]
    },
    {
      question: "\"La vida es como una caja de bombones\" es una analogía célebre de la película:",
      response: "Forrest Gump",
      options: [
        "Pulp Fiction",
        "Belleza americana",
        "Jurassic Park"
      ]
    },
    {
      question: "La película en la que se hizo famoso el personaje de Hannibal Lecter fue:",
      response: "El silencio de los inocentes",
      options: [
        "Hannibal",
        "El sexto sentido",
        "El tigre y el dragón"
      ]
    },
    {
      question: "El título del episodio IV de la Guerra de las Galaxias es:",
      response: "Una nueva esperanza",
      options: [
        "El regreso del Jedi",
        "La amenaza fantasma",
        "El cuarto elemento"
      ]
    },
    {
      question: "La famosa comedia romántica que hizo célebres a Julia Roberts y Richard Gere es:",
      response: "Mujer bonita",
      options: [
        "Cásate conmigo",
        "¿Conoces a Joe Black?",
        "La princesa y el sapo"
      ]
    },
    {
      question: "¿Quién es el director de la famosa película Terminator?",
      response: "James Cameron",
      options: [
        "Ricarch Gere",
        "Arnold Schwarzenegger",
        "Steven Spielberg"
      ]
    },
    {
      question: "En la película Hombres de Negro, el cínturón de orión hace referencia a:",
      response: "El collar de un gato",
      options: [
        "La constelación de Orión",
        "Una clave secreta",
        "Un pasadizo galáctico"
      ]
    },
    {
      question: "¿Cuál es el nombre del actor que protagoniza Danza con Lobos?",
      response: "Kevin Costner",
      options: [
        "Brad Pitt",
        "Michael Douglas",
        "Sean Connery"
      ]
    },
    {
      question: "En la película Corazón Valiente se cuenta la historia de Independencia de cuál país",
      response: "Escocia",
      options: [
        "Irlanda",
        "Gales",
        "Islandia"
      ]
    },
    {
      question: "En la película Ocean's Eleven, ¿cuál es el nombre del dueño del casino que resulta robado?",
      response: "Terry Benedict",
      options: [
        "Perry Anderson",
        "Michelle D' Fountain",
        "Percy Sullivan"
      ]
    },
    {
      question: "¿Cuál es la empresa de mensajería en la que trabajaba el personaje de Náufrago?",
      response: "FedEx",
      options: [
        "TCC",
        "UsaPostal",
        "DHL"
      ]
    },
    {
      question: "De las siguientes películas de Pixar, ¿cuál es la más antigua?",
      response: "Toy Story",
      options: [
        "Monsters Inc.",
        "Cars",
        "Bolt"
      ]
    },
    {
      question: "¿Quién es el matemático cuya vida se representa en la película Una mente brillante?",
      response: "John Nash",
      options: [
        "Joseph Fourier",
        "Carl Gauss",
        "John Neumman"
      ]
    },
    {
      question: "¿Cuál es la película en la que Jim Carrey se estrena protagonizando drama y no comedia?",
      response: "El show de Truman",
      options: [
        "El eterno resplandor",
        "Ace Ventura",
        "Historia de un amor"
      ]
    },
    {
      question: "En Volver al Futuro, ¿cuál es el año al que se dirigen los personajes cuando van al futuro?",
      response: "2015",
      options: [
        "2010",
        "2050",
        "2022"
      ]
    },
    {
      question: "¿Cuál de las siguientes películas no fue dirigida por Alejandro Gonzáles Iñárritu?",
      response: "Historias mínimas",
      options: [
        "Amores perros",
        "21 gramos",
        "Birdman"
      ]
    },
    {
      question: "¿Cuál es la película animada que protagonizan Bugs Bunny y Michael Jordan?",
      response: "Space Jam",
      options: [
        "Space Jonkie",
        "Space Dunk",
        "Quién engañó al conejo"
      ]
    },
    {
      question: "¿Cuál es la película con la que Emir Kusturica ganó su segunda Palma de Oro en Cannes?",
      response: "Underground",
      options: [
        "El viaje de papá",
        "Gato negro, gato blanco",
        "Maradona"
      ]
    }
    // ,
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