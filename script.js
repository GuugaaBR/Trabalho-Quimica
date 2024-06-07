const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const victoryCards = [
    { name: "Vitória", sprites: ["Vitória1.png", "Vitória2.png"] },
  ];
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let tempoInicio = new Date().getTime();


//Items array
const items = [
    { name: "hidrocarboneto1", sprites: ["Butano.png", "Butano Escrito.png"] },
    { name: "hidrocarboneto2", sprites: ["2,5-dimetil-hexa-1,3-dieno.png", "2,5 ESCRITO.png"] },
    { name: "hidrocarboneto3", sprites: ["M-xileno.png", "M-Xileno Escrito.png"] },
    { name: "hidrocarboneto4", sprites: ["Hex-2,4-dieno.png", "Hex-2,4-dieno Escrito.png"] },
    { name: "hidrocarboneto5", sprites: ["3-Etil-Metil-Hex-1-Eno.png", "3-Etil-Metil-Hex-1-Eno Escrito.png"] },
    { name: "hidrocarboneto6", sprites: ["Hepteno.png", "Hepteno Escrito.png"] },
    { name: "hidrocarboneto7", sprites: ["But-2-Eno.png", "But-2-Eno Escrito.png"] },
    { name: "hidrocarboneto8", sprites: ["Buteno.png", "Buteno Escrito.png"] },
    { name: "hidrocarboneto9", sprites: ["Propeno.png", "Propeno Escrito.png"] },
    { name: "hidrocarboneto10", sprites: ["P-xileno.png", "P-xileno Escrito.png"] },
    { name: "hidrocarboneto11", sprites: ["O-xileno.png", "O-xileno Escrito.png"] },
    { name: "hidrocarboneto12", sprites: ["Naftaleno.png", "Naftaleno Escrito.png"] },
    { name: "hidrocarboneto13", sprites: ["Antraceno.png", "Antraceno Escrito.png"] },
    { name: "hidrocarboneto14", sprites: ["Hept-2-ino.png", "Hept-2-ino Escrito.png"] },
    { name: "hidrocarboneto15", sprites: ["4-metil-hept-1,5-diino.png", "4-metil-hept-1,5-diino Escrito.png"] },
    { name: "hidrocarboneto16", sprites: ["Ciclobuteno.png", "Ciclobuteno Escrito.png"] },
];


//Initial Time
let seconds = 0,
  minutes = 0;
//Initial moves and win count
let movesCount = 0,
  winCount = 0;

//For timer
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
};

//For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

const generateRandom = (size = 4) => {
    let cardValues = [];
    let tempArray = [...items];

    for (let i = 0; i < size * size / 2; i++) {
        let selectedItem = tempArray[Math.floor(Math.random() * tempArray.length)];
        const sprite1 = selectedItem.sprites[0];
        const sprite2 = selectedItem.sprites[1];

        cardValues.push({ name: selectedItem.name, sprite: sprite1 });
        cardValues.push({ name: selectedItem.name, sprite: sprite2 });

        tempArray.splice(tempArray.indexOf(selectedItem), 1);
    }

    cardValues.sort(() => Math.random() - 0.5);

    return cardValues;
};
  const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    for (let i = 0; i < size * size; i++) {
      gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${cardValues[i].name}">
          <div class="card-before"></div>
          <div class="card-after">
            <img src="${cardValues[i].sprite}" class="image"/>
          </div>
        </div>
      `;
    }
    //Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;
  
    //Cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.isFlipped = false;
        card.addEventListener("click", () => {
          // Verifica se a carta já foi virada
          if (!card.isFlipped &&!card.classList.contains("matched")) {
            // Vira a carta
            card.classList.add("flipped");
            card.isFlipped = true;
            // Resto do código para comparar as cartas
            if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //increment moves since user selected second card
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //if both cards match add matched class so these cards would beignored next time
            firstCard.classList.add("matched");
secondCard.classList.add("matched");
firstCard.isFlipped = false;
secondCard.isFlipped = false;
            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of cardValues
         if (winCount == Math.floor(cardValues.length / 2)) {
  setTimeout(() => {
    result.innerHTML = `<h2>Você Venceu!</h2>
      <h4>Moves: ${movesCount}</h4>`;
    stopGame();
    controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
  let endTime = new Date().getTime();
  let totalTimeSeconds = (endTime - tempoInicio) / 1000;
  let minutesValue = Math.floor(totalTimeSeconds / 60);
  let secondsValue = String(totalTimeSeconds % 60).padStart(2, '0');
  result.innerHTML = `<h2>Você Venceu!</h2>
    <h4>Moves: ${movesCount}</h4>
    <h4>Tempo: ${minutesValue}:${secondsValue}</h4>`;
  }, 2000); // delay de 2 segundos
}
          } else {
            //if the cards dont match
            //flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempFirst.isFlipped = false;
              tempSecond.classList.remove("flipped");
              tempSecond.isFlipped = false;
            }, 1500);
          }
        }
      }
    });
  });
};

//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controls amd buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};
