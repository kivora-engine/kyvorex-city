// kyvorex-city/js/mission/mission-system.js
// Rôle : point d'entrée unique de la mission (façade appelée par main)
// Dépend de : GAME.missionState, GAME.drawMission, GAME.drawArrow, GAME.drawMissionHud
// Expose : GAME.mission (init, update, draw)

window.GAME = window.GAME || {};

GAME.mission = {

  init: function () {
    GAME.missionState.newMission();
  },

  update: function (dt) {
    GAME.missionState.update(dt);
  },

  // phase = 'world' (marqueurs, avant la voiture) ou 'overlay' (flèche + HUD)
  draw: function (ctx, phase) {
    if (phase === 'world') {
      GAME.drawMission(ctx);
    } else if (phase === 'overlay') {
      GAME.drawArrow(ctx);
      GAME.drawMissionHud(ctx);
    }
  }
};