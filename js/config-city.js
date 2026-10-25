// kyvorex-city/js/config-city.js
// Rôle : réglages de la ville et des collisions, ajout de couleurs
// Dépend de : GAME.config (créé par config.js)
// Expose : GAME.config.city + nouvelles clés dans GAME.config.colors

window.GAME = window.GAME || {};

GAME.config.city = {
  // Grille
  blocksX: 5,
  blocksY: 5,
  blockSize: 320,   // côté d'un bloc (px)
  roadWidth: 128,   // largeur d'une route (px)
  pitch: 448,       // blockSize + roadWidth
  sidewalk: 16,     // largeur du trottoir sur le pourtour d'un bloc

  // Bâtiments
  seed: 42,
  palette: [
    '#5a6b7c',
    '#7a5c47',
    '#6b5b95',
    '#8b6f47',
    '#5a7d7c'
  ],

  // Collisions
  hitFactor: 0.55,        // multiplicateur de vitesse au PREMIER contact
  slideFactor: 0.985,     // multiplicateur par frame lors d'une glissade
  carCircleRadius: 13,    // rayon de chaque cercle de collision
  carCircleCount: 3       // nombre de cercles le long de la voiture
};

// Couleurs supplémentaires pour la ville
GAME.config.colors.asphalt = '#1a1f26';
GAME.config.colors.roadLine = '#d4d4d4';
GAME.config.colors.sidewalk = '#4a5058';
GAME.config.colors.blockInterior = '#3a3f47';
GAME.config.colors.buildingOutline = '#0a0a0a';