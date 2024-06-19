const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

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

    let cards;
    let firstCard = null;
    let secondCard = null;
    let gameInProgress = false;
    let intervalId = null;

    let movesCount = 0;
    let winCount = 0;
    let seconds = 0;
    let minutes = 0;

    const timeGenerator = () => {
      seconds += 1;
      if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
      }
      let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
      let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
      timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
    };

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
          </div>`;
      }
      gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

      cards = document.querySelectorAll(".card-container");
      cards.forEach((card) => {
        card.isFlipped = false;
        card.addEventListener("click", () => {
          if (!card.isFlipped && !card.classList.contains("matched")) {
            card.classList.add("flipped");
            card.isFlipped = true;
            if (!firstCard) {
              firstCard = card;
              firstCardValue = card.getAttribute("data-card-value");
            } else {
              movesCounter();
              secondCard = card;
              let secondCardValue = card.getAttribute("data-card-value");
              if (firstCardValue == secondCardValue) {
                firstCard.classList.add("matched");
                secondCard.classList.add("matched");
                firstCard.isFlipped = false;
                secondCard.isFlipped = false;
                firstCard = null;
                winCount += 1;
                if (winCount == Math.floor(cardValues.length / 2)) {
                  setTimeout(() => {
                    result.innerHTML = `
                      <h2>Você Venceu!</h2>
                      <h6>Moves: ${movesCount}</h6>
                      <h4>Tempo: ${minutes}:${seconds}</h4>
                      <button id="play-again">Jogar Novamente</button>`;
                    controls.classList.remove("hide");
                    stopButton.classList.add("hide");
                    startButton.classList.remove("hide");
                    clearInterval(intervalId);
                    gameInProgress = false;
                    document.getElementById("play-again").addEventListener("click", () => {
                      result.innerHTML = "";
                      controls.classList.add("hide");
                      stopButton.classList.remove("hide");
                      startButton.classList.add("hide");
                      movesCount = 0;
                      seconds = 0;
                      minutes = 0;
                      timeValue.innerHTML = `<span>Time: </span>00:00`;
                      moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
                      initializer();
                      gameInProgress = true;
                    });
                  }, 2000); // 2 segundos de delay
                }
              } else {
                let [tempFirst, tempSecond] = [firstCard, secondCard];
                setTimeout(() => {
                  tempFirst.classList.remove("flipped");
                  tempFirst.isFlipped = false;
                  tempSecond.classList.remove("flipped");
                  tempSecond.isFlipped = false;
                  firstCard = null;
                  secondCard = null;
                }, 1000);
              }
            }
          }
        });
      });
    };

    startButton.addEventListener("click", () => {
      if (!gameInProgress) {
        movesCount = 0;
        seconds = 0;
        minutes = 0;
        timeValue.innerHTML = `<span>Time: </span>00:00`;
        controls.classList.add("hide");
        stopButton.classList.remove("hide");
        startButton.classList.add("hide");
        if (intervalId) {
          clearInterval(intervalId);
        }
        intervalId = setInterval(timeGenerator, 1000);
        moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
        initializer();
        gameInProgress = true;
      }
    });

    stopButton.addEventListener("click", () => {
      controls.classList.remove("hide");
      stopButton.classList.add("hide");
      startButton.classList.remove("hide");
      clearInterval(intervalId);
      gameInProgress = false;
    });

    const initializer = () => {
      result.innerText = "";
      winCount = 0;
      let cardValues = generateRandom();
      matrixGenerator(cardValues);
    };
