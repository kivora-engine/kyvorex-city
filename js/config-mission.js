// kyvorex-city/js/config-mission.js
// Rôle : réglages de la mission (distances, chrono, rayons)
// Dépend de : GAME.config (créé par config.js)
// Expose : GAME.config.mission

window.GAME = window.GAME || {};

GAME.config.mission = {
  pickupMinDist: 500,     // distance min voiture -> colis (px)
  pickupMaxDist: 1200,    // distance max voiture -> colis (px)
  deliveryMinDist: 900,   // distance min colis -> livraison (px)
  deliveryMaxDist: 2000,  // distance max colis -> livraison (px)
  triggerRadius: 70,      // rayon de déclenchement (px)
  baseTime: 8,            // temps de base accordé (s)
  speedForTime: 170,      // px/s pour calculer le temps additionnel
  messageDuration: 2      // durée des messages "Livré !" / "Trop tard !" (s)
};