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

GAME.config.colors.lawn = '#2e4636';
GAME.config.colors.path = '#5a6068';
GAME.config.colors.apron = '#2b3037';

// Quartier de maisons : les blocs dont la colonne bx est <= bxMax (2 x 2 maisons par bloc)
GAME.config.city.houses = {
  bxMax: 1,
  lot: 132, gap: 24, margin: 10,
  minW: 70, maxW: 96, minH: 58, maxH: 78,
  walls: ['#b8a58a', '#a7b3a0', '#c2a07f', '#9aa9b8', '#b58f84'],
  roofs: ['#6b3b2e', '#3f4a57', '#5a4636', '#2f3a2f']
};

// Bâtiments publics : un par bloc (colonne bx, ligne by), le garage donne vers la route du sud
GAME.config.city.pois = [
  { type: 'commissariat', bx: 3, by: 2, w: 200, h: 140, doors: 1, color: '#2f4f8f' },
  { type: 'caserne',      bx: 2, by: 4, w: 220, h: 150, doors: 2, color: '#a8352b' },
  { type: 'hopital',      bx: 4, by: 1, w: 230, h: 150, doors: 1, color: '#d5dae0' }
];
