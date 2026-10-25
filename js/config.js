// kyvorex-city/js/config.js
// Rôle : tous les réglages du jeu, regroupés dans GAME.config
// Dépend de : rien (premier script chargé)
// Expose : GAME.config

window.GAME = window.GAME || {};

GAME.config = {

  // --- Physique de la voiture (pixels, secondes, radians) ---
  car: {
    accel: 260,
    brake: 420,
    maxSpeed: 340,
    maxReverse: 120,
    friction: 140,
    turnSpeed: 2.6,
    minTurnSpeed: 20,
    width: 28,
    length: 48,
    radius: 6
  },

  // --- Caméra ---
  camera: {
    smooth: 7
  },

  // --- Monde ---
  world: {
    gridSize: 64
  },

  // --- Palette rétro ---
  colors: {
    ground: '#16241c',
    grid: '#22392c',
    body: '#d94f3d',
    bodyDark: '#a83a2c',
    glass: '#1e2b38',
    light: '#ffe9a8',
    hud: '#9dffc4'
  },

  // --- Debug (désactivé en version publique) ---
  debug: {
    showHud: false
  }
};