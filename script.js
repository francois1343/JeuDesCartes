let playerHand = [];
let computerDeck = [];

let currentTurn = 0;
let score = 0;
let timeLeft = 60;
let timer = null;
let gameOver = false;

const scoreEl = document.getElementById("score");
const turnEl = document.getElementById("turn");
const timerEl = document.getElementById("timer");

const computerCard = document.getElementById("computer-card-display");
const playerHandEl = document.getElementById("player-hand");

const passBtn = document.getElementById("btn-pass");
const replayBtn = document.getElementById("btn-replay");

function randomCard() {
  return Math.floor(Math.random() * 10) + 1;
}

function initGame() {
  score = 0;
  currentTurn = 0;
  timeLeft = 60;
  gameOver = false;

  clearInterval(timer);

  playerHand = [];

  for (let i = 0; i < 5; i++) {
    playerHand.push(randomCard());
  }

  playerHand.sort((a, b) => a - b);

  computerDeck = [];

  for (let i = 0; i < 10; i++) {
    computerDeck.push(randomCard());
  }

  passBtn.classList.remove("hidden");
  replayBtn.classList.add("hidden");
  timerEl.classList.remove("timer-low");

  updateScore();
  updateTimer();

  startTimer();
  showTurn();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;

    updateTimer();

    if (timeLeft <= 10) {
      timerEl.classList.add("timer-low");
    }

    if (timeLeft <= 0) {
      endGame("Temps écoulé !");
    }
  }, 1000);
}

function updateTimer() {
  timerEl.textContent = timeLeft;
}

function showTurn() {
  if (gameOver) return;

  if (currentTurn >= 10) {
    endGame("Partie terminée !");
    return;
  }

  turnEl.textContent = currentTurn + 1;

  const card = computerDeck[currentTurn];

  computerCard.innerHTML = `
    <div class="card">${card}</div>
  `;

  showPlayerCards();
}

function showPlayerCards() {
  playerHandEl.innerHTML = "";

  playerHand.forEach((value, index) => {
    const card = document.createElement("div");

    card.classList.add("card");
    card.textContent = value;

    card.addEventListener("click", () => {
      playCard(value, index, card);
    });

    playerHandEl.appendChild(card);
  });
}

function playCard(value, index, card) {
  if (gameOver) return;

  const computerValue = computerDeck[currentTurn];

  if (value === computerValue) {
    score++;

    playerHand.splice(index, 1);

    updateScore();
    nextTurn();
  } else {
    card.classList.add("wrong");

    setTimeout(() => {
      card.classList.remove("wrong");
    }, 300);
  }
}

function nextTurn() {
  currentTurn++;
  showTurn();
}

function updateScore() {
  scoreEl.textContent = score;
}

function endGame(message) {
  gameOver = true;

  clearInterval(timer);

  computerCard.innerHTML = `
    <div class="card end-message">${message}</div>
  `;

  passBtn.classList.add("hidden");
  replayBtn.classList.remove("hidden");
}

passBtn.addEventListener("click", nextTurn);
replayBtn.addEventListener("click", initGame);

initGame();
