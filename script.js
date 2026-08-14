// Constantes de jeu
const COULEURS = ["rouge", "noire"];
const SYMBOLES = { rouge: "♥", noire: "♠" };

// État de la partie
let mainJoueur = [];
let deckOrdi = [];
let tourIndex = 0;
let score = 0;
let tempsRestant = 60;
let intervalTimer = null;
let jeuFini = false;

// Suivi du Drag & Drop
let carteEnCoursDeDrag = null;
let indexCarteDragguee = null;

// Éléments UI
const elScore = document.getElementById("score");
const elTour = document.getElementById("turn");
const elTimer = document.getElementById("timer");
const elCarteOrdi = document.getElementById("computer-card-display");
const elMainJoueur = document.getElementById("player-hand");
const elDropZone = document.getElementById("drop-zone");
const elMessage = document.getElementById("game-message");
const btnPasser = document.getElementById("btn-pass");
const btnRejouer = document.getElementById("btn-replay");

// Génère un jeu complet de 20 cartes uniques (1-10 en rouge et en noire)
function genererPaquetComplet() {
  const paquet = [];
  for (const couleur of COULEURS) {
    for (let valeur = 1; valeur <= 10; valeur++) {
      paquet.push({ valeur, couleur });
    }
  }
  return paquet;
}

// Mélange un tableau de cartes
function melanger(tableau) {
  const copie = [...tableau];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

// Initialisation
function nouvellePartie() {
  score = 0;
  tourIndex = 0;
  tempsRestant = 60;
  jeuFini = false;

  if (intervalTimer) clearInterval(intervalTimer);

  // L'ordi prend 10 cartes uniques mélangées dans le paquet
  const paquetMélangé = melanger(genererPaquetComplet());
  deckOrdi = paquetMélangé.slice(0, 10);

  // Tirage aléatoire de 5 cartes pour le joueur
  mainJoueur = Array.from({ length: 5 }, () => {
    const val = Math.floor(Math.random() * 10) + 1;
    const coul = COULEURS[Math.floor(Math.random() * COULEURS.length)];
    return { valeur: val, couleur: coul };
  });

  btnPasser.classList.remove("hidden");
  btnRejouer.classList.add("hidden");
  elTimer.classList.remove("timer-low");
  elMessage.textContent = "";

  majScoreUI();
  majTimerUI();
  demarrerChrono();
  initialiserEventsDrop();
  afficherTour();
}

function demarrerChrono() {
  intervalTimer = setInterval(() => {
    tempsRestant--;
    majTimerUI();

    if (tempsRestant <= 10) {
      elTimer.classList.add("timer-low");
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
  elMessage.textContent = "";

  // Affichage carte ordinateur
  const carteActuelle = deckOrdi[tourIndex];
  elCarteOrdi.innerHTML = creerelementCarteHTML(carteActuelle);

  // Affichage main joueur
  afficherMainJoueur();
}

// Fabrique le rendu HTML d'une carte
function creerelementCarteHTML(carte) {
  const symbole = SYMBOLES[carte.couleur];
  return `
    <div class="card ${carte.couleur}">
      <span>${carte.valeur}</span>
      <span class="symbol">${symbole}</span>
    </div>
  `;
}

// Affiche la main du joueur avec les écouteurs Drag
function afficherMainJoueur() {
  elMainJoueur.innerHTML = "";

  mainJoueur.forEach((carte, index) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = creerelementCarteHTML(carte);
    const divCarte = tempDiv.firstElementChild;

    // Configuration Drag
    divCarte.setAttribute("draggable", "true");

    divCarte.addEventListener("dragstart", (e) => {
      carteEnCoursDeDrag = carte;
      indexCarteDragguee = index;
      e.target.classList.add("active");
      e.dataTransfer.effectAllowed = "move";
    });

    divCarte.addEventListener("dragend", (e) => {
      e.target.classList.remove("active");
    });

    elMainJoueur.appendChild(divCarte);
  });
}

// Initialise la zone de dépôt (Drop Zone)
function initialiserEventsDrop() {
  elDropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    elDropZone.classList.add("active");
  });

  elDropZone.addEventListener("dragleave", (e) => {
    e.preventDefault();
    elDropZone.classList.remove("active");
  });

  elDropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    elDropZone.classList.remove("active");

    if (!carteEnCoursDeDrag || jeuFini) return;

    traiterTentative(carteEnCoursDeDrag, indexCarteDragguee);

    // Réinitialisation après dépôt
    carteEnCoursDeDrag = null;
    indexCarteDragguee = null;
  });
}

// Vérifie les règles au moment du drop
function traiterTentative(carteJoueur, index) {
  const carteOrdi = deckOrdi[tourIndex];

  // Regle 1 : Valide (Même valeur + Même couleur)
  if (
    carteJoueur.valeur === carteOrdi.valeur &&
    carteJoueur.couleur === carteOrdi.couleur
  ) {
    score++;
    mainJoueur.splice(index, 1);
    majScoreUI();
    tourSuivant();
  }
  // Regle 2 : Même valeur mais couleur opposée => vous devez passer
  else if (
    carteJoueur.valeur === carteOrdi.valeur &&
    carteJoueur.couleur !== carteOrdi.couleur
  ) {
    elMessage.textContent = `Vous avez le ${carteJoueur.valeur} en ${carteJoueur.couleur} : vous devez passer votre tour !`;
  }
  // Regle 3 : Carte incompatible
  else {
    elMessage.textContent = "Cette carte ne correspond pas du tout !";
  }
}

function tourSuivant() {
  tourIndex++;
  afficherTour();
}

function terminerPartie(message) {
  jeuFini = true;
  clearInterval(intervalTimer);

  elCarteOrdi.innerHTML = `<div class="card" style="font-size:0.85rem; padding:8px; width:85px;">${message}</div>`;
  elMessage.textContent = `Partie terminée ! Score : ${score} pt(s)`;
  btnPasser.classList.add("hidden");
  btnRejouer.classList.remove("hidden");
}

// Événements boutons
btnPasser.addEventListener("click", tourSuivant);
btnRejouer.addEventListener("click", nouvellePartie);

// Lancement au chargement
nouvellePartie();
