// kyvorex-city/js/config-finition.js
// Rôle : réglages audio et ressenti (secousse)
// Dépend de : GAME.config (créé par config.js)
// Expose : GAME.config.audio, GAME.config.feel

window.GAME = window.GAME || {};

GAME.config.audio = {
  enabled: true,
  master: 0.6,
  engineVol: 0.10,
  engineMinHz: 55,
  engineMaxHz: 170,
  sirenVol: 0.08,
  sirenMaxDist: 700,
  sirenHz1: 640,
  sirenHz2: 860,
  sirenPeriod: 0.5,
  crashVol: 0.35,
  crashMinImpact: 30,
  muteKey: 'kyvorex-gta-retro-mute'
};

GAME.config.feel = {
  shakeImpactMin: 120,
  shakePower: 8,
  shakeDuration: 0.25
};