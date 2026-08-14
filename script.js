// Constantes de jeu
const COULEURS = ['rouge', 'noire'];
const SYMBOLES = { rouge: '♥', noire: '♠' };

// État de la partie
let mainJoueur = [];
let deckOrdi = [];
let tourIndex = 0;
let score = 0;
let tempsRestant = 60;
let intervalTimer = null;
let jeuFini = false;

// Éléments UI
const elScore = document.getElementById('score');
const elTour = document.getElementById('turn');
const elTimer = document.getElementById('timer');
const elCarteOrdi = document.getElementById('computer-card-display');
const elMainJoueur = document.getElementById('player-hand');
const elMessage = document.getElementById('game-message');
const btnPasser = document.getElementById('btn-pass');
const btnRejouer = document.getElementById('btn-replay');

// Génère une carte aléatoire
function tirerUneCarte() {
  const valeur = Math.floor(Math.random() * 10) + 1;
  const couleur = COULEURS[Math.floor(Math.random() * COULEURS.length)];
  return { valeur, couleur };
}

// Initialisation
function nouvellePartie() {
  score = 0;
  tourIndex = 0;
  tempsRestant = 60;
  jeuFini = false;

  if (intervalTimer) clearInterval(intervalTimer);

  // Generer les tirages
  mainJoueur = Array.from({ length: 5 }, tirerUneCarte);
  deckOrdi = Array.from({ length: 10 }, tirerUneCarte);

  btnPasser.classList.remove('hidden');
  btnRejouer.classList.add('hidden');
  elTimer.classList.remove('timer-low');
  elMessage.textContent = '';

  majScoreUI();
  majTimerUI();
  demarrerChrono();
  afficherTour();
}

function demarrerChrono() {
  intervalTimer = setInterval(() => {
    tempsRestant--;
    majTimerUI();

    if (tempsRestant <= 10) {
      elTimer.classList.add('timer-low');
    }

    if (tempsRestant <= 0) {
      terminerPartie("Temps écoulé !");
    }
  }, 1000);
}

function majTimerUI() {
  elTimer.textContent = tempsRestant;
}

function majScoreUI() {
  elScore.textContent = score;
}

function afficherTour() {
  if (jeuFini) return;

  if (tourIndex >= 10) {
    terminerPartie("Fin des 10 tirages !");
    return;
  }

  elTour.textContent = tourIndex + 1;
  elMessage.textContent = '';

  // Carte ordi
  const carteActuelle = deckOrdi[tourIndex];
  elCarteOrdi.innerHTML = creerelementCarte(carteActuelle);

  // Cartes joueur
  afficherMainJoueur();
}

// Fabrique le HTML d'une carte
function creerelementCarte(carte) {
  const symbole = SYMBOLES[carte.couleur];
  return `
    <div class="card ${carte.couleur}">
      <span>${carte.valeur}</span>
      <span class="symbol">${symbole}</span>
    </div>
  `;
}

function afficherMainJoueur() {
  elMainJoueur.innerHTML = '';

  mainJoueur.forEach((carte, idx) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = creerelementCarte(carte);
    const divCarte = wrapper.firstElementChild;

    divCarte.addEventListener('click', () => jouerCarte(carte, idx, divCarte));
    elMainJoueur.appendChild(divCarte);
  });
}

function jouerCarte(carteJoueur, index, elementHtml) {
  if (jeuFini) return;

  const carteOrdi = deckOrdi[tourIndex];

  // Cas 1 : Même valeur ET même couleur => Gagné
  if (carteJoueur.valeur === carteOrdi.valeur && carteJoueur.couleur === carteOrdi.couleur) {
    score++;
    mainJoueur.splice(index, 1);
    majScoreUI();
    tourSuivant();
  }
  // Cas 2 : Même valeur mais couleur OPPOSÉE => Règle V4 (Vous devez passer)
  else if (carteJoueur.valeur === carteOrdi.valeur && carteJoueur.couleur !== carteOrdi.couleur) {
    elementHtml.classList.add('wrong');
    elMessage.textContent = `Vous avez la même valeur en ${carteJoueur.couleur} : vous devez passer !`;
    setTimeout(() => elementHtml.classList.remove('wrong'), 400);
  }
  // Cas 3 : Carte complètement différente
  else {
    elementHtml.classList.add('wrong');
    elMessage.textContent = "Carte incompatible.";
    setTimeout(() => elementHtml.classList.remove('wrong'), 400);
  }
}

function tourSuivant() {
  tourIndex++;
  afficherTour();
}

function terminerPartie(message) {
  jeuFini = true;
  clearInterval(intervalTimer);

  elCarteOrdi.innerHTML = `<div class="card" style="font-size:0.9rem; padding:10px; width:90px;">${message}</div>`;
  elMessage.textContent = `Partie terminée. Score final : ${score} pt(s)`;
  btnPasser.classList.add('hidden');
  btnRejouer.classList.remove('hidden');
}

// Événements
btnPasser.addEventListener('click', tourSuivant);
btnRejouer.addEventListener('click', nouvellePartie);

// Lancement au chargement
nouvellePartie();