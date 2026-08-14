// État du jeu
let playerHand = [];
let computerDeck = [];
let currentTurnIndex = 0;
let score = 0;

// Éléments DOM
const scoreEl = document.getElementById('score');
const turnEl = document.getElementById('turn');
const computerCardDisplay = document.getElementById('computer-card-display');
const playerHandEl = document.getElementById('player-hand');
const btnPass = document.getElementById('btn-pass');
const btnReplay = document.getElementById('btn-replay');

// Générer un entier aléatoire entre min et max (inclus)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialisation d'une partie
function initGame() {
  score = 0;
  currentTurnIndex = 0;

  // 1. Tirer 5 cartes aléatoires (1 à 10) pour le joueur et les trier par ordre croissant
  playerHand = [];
  for (let i = 0; i < 5; i++) {
    playerHand.push(getRandomInt(1, 10));
  }
  playerHand.sort((a, b) => a - b);

  // 2. Préparer les 10 tirages de l'ordinateur (1 à 10 aléatoires)
  computerDeck = [];
  for (let i = 0; i < 10; i++) {
    computerDeck.push(getRandomInt(1, 10));
  }

  // 3. Réinitialiser l'interface
  btnPass.classList.remove('hidden');
  btnReplay.classList.add('hidden');
  updateScoreUI();

  // Démarrer le premier tour
  renderTurn();
}

// Affichage d'un tour
function renderTurn() {
  if (currentTurnIndex >= 10) {
    endGame();
    return;
  }

  turnEl.textContent = currentTurnIndex + 1;

  // Carte tirée par l'ordinateur
  const currentCard = computerDeck[currentTurnIndex];
  computerCardDisplay.innerHTML = `<div class="card">${currentCard}</div>`;

  // Main du joueur
  renderPlayerHand();
}

// Rendu des cartes du joueur
function renderPlayerHand() {
  playerHandEl.innerHTML = '';
  playerHand.forEach((value, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.textContent = value;
    cardDiv.addEventListener('click', () => handleCardClick(value, index, cardDiv));
    playerHandEl.appendChild(cardDiv);
  });
}

// Gestion du clic sur une carte du joueur
function handleCardClick(value, index, element) {
  const currentComputerCard = computerDeck[currentTurnIndex];

  if (value === currentComputerCard) {
    // Bonne carte : +1 point et la carte disparaît de la main
    score++;
    playerHand.splice(index, 1);
    updateScoreUI();
    nextTurn();
  } else {
    // Mauvaise carte : animation visuelle d'erreur
    element.classList.add('wrong');
    setTimeout(() => element.classList.remove('wrong'), 300);
  }
}

// Passer son tour (0pt marqué)
function handlePass() {
  nextTurn();
}

// Passer au tour suivant
function nextTurn() {
  currentTurnIndex++;
  renderTurn();
}

// Mise à jour du score
function updateScoreUI() {
  scoreEl.textContent = score;
}

// Fin de partie
function endGame() {
  computerCardDisplay.innerHTML = `<div class="card" style="font-size: 1rem; padding: 10px;">Fin !</div>`;
  btnPass.classList.add('hidden');
  btnReplay.classList.remove('hidden');
}

// Événements
btnPass.addEventListener('click', handlePass);
btnReplay.addEventListener('click', initGame);

// Lancement automatique au chargement
initGame();