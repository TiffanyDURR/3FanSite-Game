// Variables
const songs = [
  {
    id: "0",
    titre: "La wave attitude",
  },
  {
    id: "1",
    titre: "La galère d'un pirate",
  },
  {
    id: "2",
    titre: "I love U so much",
  },
  {
    id: "3",
    titre: "Génération 90's",
  },
  {
    id: "4",
    titre: "Babos à la playa",
  },
  {
    id: "5",
    titre: "Le plus grand des bonheurs",
  },
  {
    id: "6",
    titre: "C'est pas punk",
  },
  {
    id: "7",
    titre: "Sombre héros",
  },
  {
    id: "8",
    titre: "Hey baybay ",
  },
  {
    id: "9",
    titre: "Reviens",
  },
  {
    id: "10",
    titre: "Cliquer comme un con",
  },
  {
    id: "11",
    titre: "Bon voyage",
  },
  {
    id: "12",
    titre: "Le ver",
  },
  {
    id: "13",
    titre: "Et à la fin..",
  },
  {
    id: "14",
    titre: "Cheese Powers",
  },
  {
    id: "15",
    titre: "Mon rêve",
  },
  {
    id: "16",
    titre: "Ma cigarette",
  },
  {
    id: "17",
    titre: "Imagine la galère",
  },
  {
    id: "18",
    titre: "Comptez sur moi",
  },
  {
    id: "19",
    titre: "BB Rockers",
  },
];

// DOM
let inputContainer = document.querySelector("input");
let inputValue = document.querySelector("input").value.toLocaleLowerCase();
let scoreContainer = document.querySelector(".score > div");
let button = document.querySelector(".button");
let alertContainer = document.querySelector(".alertContainer");
let mainContent = document.querySelector("main");
let thumbIMG = document.querySelector(".thumbIMG");
let foundSongsArray = [];
let newFoundSongsArray;
let imagesPNG = document.querySelectorAll(".imgsGame img");
let reponsesContainer = document.querySelector(`.answers`);
let restart = document.querySelector(".recommencer");
let winDiv = document.querySelector(".win");
let innerContainer = document.querySelector(".inner");
let overlayBegin = document.querySelector(`.letsGo`);
let buttonBegin = document.querySelector(`.commencer`);
let timeScoreContainer = document.querySelector(".timeScore");
let pngID;
let songTitle = "notSelected";

// Timer
let startButton = document.querySelector("[data-action=start]");
let stopButton = document.querySelector("[data-action=stop]");
let minutes = document.querySelector(".minutes");
let seconds = document.querySelector(".seconds");
let timerContainer = document.querySelector(".timer");
let timerTime = 0;
let isRunning = false;
let interval;
let x;

inputContainer.addEventListener("input", (e) => {
  inputValue = e.target.value.toLocaleLowerCase();
});

buttonBegin.addEventListener("click", startTimer);
buttonBegin.addEventListener("click", () => {
  buttonBegin.style.display = "none";
  overlayBegin.style.display = "none";
});

restart.addEventListener("click", () => {
  location.reload();
});

function init() {
  pngIDfinder();
  sendReponse();
}

init();

function undefinedSong() {
  alertContainer.innerHTML = `<div class="alert">
        <span></span>
        Retrouvez les 20 éléments cachés !
        <span></span>
        </div>`;
  x = 4000;
  displayAlert(x);
}

// Fonction permettant d'identifier l'ID de l'image cliquée
function pngIDfinder() {
  imagesPNG.forEach((PNG) => {
    pngID = document.getElementById(`${PNG.id}`);
    pngID.addEventListener("click", (e) => {
      let newId = e.target.id;
      pngID = document.getElementById(`${newId}`);
      displayThumb();
      getSong();
    });
  });
}

// Affiche la miniature de l'image cliquée
function displayThumb() {
  thumbIMG.innerHTML = `<div><img src="assets/${pngID.id}.png"><div>`;
}

// Récupère le titre de la chanson en fonction de l'image qui lui correspond
function getSong() {
  let id = pngID.id;
  songTitle = songs[id].titre.toLocaleLowerCase();
}

// Fonctions permettant de comparer le résulat de l'input avec le titre de la chanson

function similarity(inputValue, songTitle) {
  let longer = inputValue;
  let shorter = songTitle;
  if (inputValue.length < songTitle.length) {
    longer = songTitle;
    shorter = inputValue;
  }
  let longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(inputValue, songTitle) {
  let costs = new Array();
  for (let i = 0; i <= inputValue.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= songTitle.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (inputValue.charAt(i - 1) != songTitle.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[songTitle.length] = lastValue;
  }
  return costs[songTitle.length];
}

// Vide l'input
function cleanInput() {
  inputContainer.value = "";
  inputValue = "";
}

// Tableau dans lequel s'incrémente les réponses justes
// Supression des entrées en double
function displayArray() {
  newFoundSongsArray = [...new Set(foundSongsArray)];
  scoreContainer.innerHTML = `${newFoundSongsArray.length} / 20`;
}

// Actions si l'input match avec la réponse
function actionsIfTrue() {
  foundSongsArray.push(songTitle);
  displayArray();

  pngID.style.display = "none";
  thumbIMG.innerHTML = ``;
  alertContainer.innerHTML = `<div class="alert">
        <span>Chanson trouvée !</span>
        ${songTitle}
        <span>Un point en plus <i class="fas fa-thumbs-up"></i> ! </span>
        </div>`;
  x = 2000;
  displayAlert(x);
  cleanInput();
}

// Actions si l'input ne match pas avec la réponse
function actionsIfFalse() {
  displayArray();
  alertContainer.innerHTML = `<div class="alert">
        <span>Mauvaise réponse !</span>
        <span>Pas de point en plus <i class="fas fa-heart-broken"></i>...</span>
        </div>`;
  x = 2000;
  displayAlert(x);
}

// Actions si aucune image est selectionnée
function actionsIfUndefined() {
  displayArray();
  alertContainer.innerHTML = `<div class="alert">
        <span>Tu dois sélectionner un élément avant de répondre !</span>
        </div>`;
  x = 2000;
  displayAlert(x);
}

// Actions si aucune image est selectionnée
function actionsIfEmptyInput() {
  displayArray();
  alertContainer.innerHTML = `<div class="alert">
        <span>Tu dois entrer une réponse !</span>
        </div>`;
  x = 2000;
  displayAlert(x);
}

// Dégage l'alerte au bout de 2 secondes
function displayAlert() {
  function hideAlert() {
    alertContainer.innerHTML = ``;
  }
  window.setTimeout(hideAlert, x);
  alertContainer.set;
}

// Lorsque l'utilisateur valide sa réponse
function sendReponse() {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    if (songTitle === undefined || songTitle == undefined || songTitle === "undefined" || songTitle == "undefined" || songTitle == null || songTitle === null || songTitle == "notSelected") {
      actionsIfUndefined();
    }
    let pourcent = similarity(inputValue, songTitle);
    let pourcentRound = pourcent * 100;
    let scorePourcent = Math.round(pourcentRound);
    if (inputValue == "" || inputValue == "<empty string>") {
      actionsIfEmptyInput();
    } else if (scorePourcent > 75 && songTitle != "notSelected") {
      console.log(scorePourcent);
      actionsIfTrue();
      songTitle = "notSelected";
    } else if (scorePourcent < 75 && songTitle != "notSelected") {
      actionsIfFalse();
    }
    winGame();
  });
}

// Fonctions pour le Timer
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  interval = setInterval(incrementTimer, 850);
}

function stopTimer() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(interval);
}

function pad(number) {
  return number < 10 ? "0" + number : number;
}

function incrementTimer() {
  timerTime++;
  const numOfminutes = Math.floor(timerTime / 60);
  const numOfSeconds = timerTime % 60;
  minutes.innerText = pad(numOfminutes);
  seconds.innerText = pad(numOfSeconds);
}

function winGame() {
  if (foundSongsArray.length == 20) {
    innerContainer.style.display = "none";
    overlayBegin.style.display = "block";
    winDiv.style.display = "inline-block";
    innerContainer.style.display = "none";
    alertContainer.style.display = "none";
    timeScoreContainer.innerHTML = `
    ${minutes.textContent} : ${seconds.textContent} 

    `;
    timerContainer.style.display = "none";
    inputContainer.style.display = "none";
    scoreContainer.style.display = "none";
    console.log(minutes.textContent);
    console.log(seconds.textContent);
  }
}
