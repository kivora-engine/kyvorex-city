// kyvorex-city/js/config-police.js
// Rôle : réglages de la police et de la jauge d'alerte
// Dépend de : GAME.config (créé par config.js)
// Expose : GAME.config.police

window.GAME = window.GAME || {};

GAME.config.police = {
  // Jauge d'alerte
  maxGauge: 100,
  impactThreshold: 120,   // vitesse minimale pour ajouter
  impactAdd: 25,          // points ajoutés par choc violent
  impactCooldown: 0.5,    // secondes entre deux ajouts
  activateAt: 50,         // seuil d'activation
  decayPerSec: 6,         // points perdus par seconde
  nearPlayerRadius: 300,  // police proche => pas de décroissance
  fleeDuration: 1.5,      // clignotement avant disparition

  // Voitures
  maxCars: 2,
  spawnDelaySecond: 5,    // délai 2e voiture (s)
  spawnMinDist: 650,      // distance min d'apparition (px)
  spawnMaxDist: 1100,     // distance max d'apparition (px)

  // Physique police
  maxSpeed: 310,          // < joueur (340) : on peut les semer
  accel: 220,
  turnSpeed: 3.2,         // rotation max (rad/s)
  brakeDecel: 300,        // décélération quand il faut freiner (px/s²)

  // Conduite prudente près du joueur / en virage
  cornerAngle: 0.5,       // angle (rad) au-delà duquel on considère un virage serré
  cornerSpeed: 170,       // vitesse max en virage serré (px/s)
  slowRadius: 220,        // distance sous laquelle la police ralentit (px)
  slowSpeed: 140,         // vitesse max à proximité du joueur (px/s)

  // Anti-blocage
  stuckSpeed: 30,         // sous cette vitesse, on compte comme bloqué (px/s)
  stuckTime: 1.2,         // durée de blocage avant téléport (s)

  // Collisions bâtiments / bords
  hitFactor: 0.6,         // multiplicateur au PREMIER contact
  slideFactor: 0.985,     // multiplicateur par frame lors d'une glissade

  // Chemin sur la grille
  nodeReach: 60,
  repathInterval: 0.5,

  // Contact avec le joueur
  contactRadius: 36,
  contactSpeedMult: 0.5,
  contactGaugeAdd: 10,
  contactCooldown: 1.0,

  // Push entre voitures de police
  policePushRadius: 40
};