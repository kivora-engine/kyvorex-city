// kyvorex-city/js/config-game.js
// Rôle : réglages de la boucle de jeu (argent, vies, arrestation, record)
// Dépend de : GAME.config (créé par config.js)
// Expose : GAME.config.game

window.GAME = window.GAME || {};

GAME.config.game = {
  startLives: 3,             // vies au démarrage d'une partie
  baseReward: 100,           // argent de base par livraison
  bonusPerSecond: 10,        // bonus par seconde restante au chrono
  arrestRadius: 60,          // distance max police-joueur pour arrestation (px)
  arrestSpeedThreshold: 60,  // vitesse max (px/s) pour être arrêtable
  arrestRiseRate: 1,         // montée de la jauge d'arrestation (par s)
  arrestFallRate: 2,         // descente de la jauge d'arrestation (par s)
  arrestMax: 2.0,            // seuil de game over par arrestation
  restartDelay: 0.8,         // délai avant que REJOUER soit actif (s)
  bestKey: 'kyvorex-gta-retro-best' // clé localStorage du record
};