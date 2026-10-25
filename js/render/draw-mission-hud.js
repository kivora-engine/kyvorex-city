// kyvorex-city/js/render/draw-mission-hud.js
// Rôle : HUD mission (message au centre-haut, chrono en haut à droite)
// Dépend de : GAME.missionState, GAME.camera, GAME.config.mission
// Expose : GAME.drawMissionHud(ctx)

window.GAME = window.GAME || {};

GAME.drawMissionHud = function (ctx) {
  var ms = GAME.missionState;
  var cam = GAME.camera;

  // --- Message central (sous le chrono) ---
  var msg = ms.getMessage();
  if (msg.text) {
    ctx.save();
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    var tw = ctx.measureText(msg.text).width;
    var boxX = (cam.w - tw) / 2 - 12;
    var boxY = 58;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(boxX, boxY, tw + 24, 30);
    ctx.fillStyle = msg.color;
    ctx.fillText(msg.text, cam.w / 2, boxY + 6);
    ctx.restore();
  }

  // --- Chrono en haut à droite (uniquement pendant la livraison) ---
  if (ms.state === 'delivery' && ms.timeLeft > 0) {
    var secs = Math.ceil(ms.timeLeft);
    var texte = secs + 's';

    ctx.save();
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    var tw2 = ctx.measureText(texte).width;
    var boxW = tw2 + 24;
    var boxX2 = cam.w - boxW - 8;

    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(boxX2, 8, boxW, 44);

    // Rouge sous 5 secondes, vert sinon
    ctx.fillStyle = ms.timeLeft < 5 ? '#ff6666' : '#66ff99';
    ctx.fillText(texte, cam.w - 20, 14);
    ctx.restore();
  }
};