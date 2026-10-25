// kyvorex-city/js/input/input-state.js
// Rôle : état brut des commandes, rempli par keyboard.js et touch.js
// Dépend de : GAME (créé par config.js)
// Expose : GAME.input

window.GAME = window.GAME || {};

GAME.input = {
  left: false,
  right: false,
  gas: false,
  brake: false
};

// Sécurité : remet toutes les commandes à zéro (anti bouton coincé)
GAME.input.reset = function () {
  GAME.input.left = false;
  GAME.input.right = false;
  GAME.input.gas = false;
  GAME.input.brake = false;
};