// kyvorex-city/js/render/draw-score-hud.js
// Rôle : HUD argent, vies, meilleur score, jauge d'arrestation, gain récent
// Dépend de : GAME.score, GAME.game, GAME.missionState, GAME.camera, GAME.config.game
// Expose : GAME.drawScoreHud(ctx)

window.GAME = window.GAME || {};

GAME.drawScoreHud = function (ctx) {
  var cam = GAME.camera;
  var s = GAME.score;
  var g = GAME.game;
  var cfg = GAME.config.game;

  // Sans le compteur FPS (version publique), on remonte le bloc argent/vies/record
  var oy = GAME.config.debug.showHud ? 0 : -28;

  ctx.save();
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  // Argent (sous le HUD debug qui finit à y=32)
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#66ff99';
  ctx.fillText('$ ' + s.money, 16, 40 + oy);

  // Vies : 3 carrés (plein = vie restante, contour = vie perdue)
  for (var i = 0; i < cfg.startLives; i++) {
    var x = 16 + i * 22;
    var y = 62 + oy;
    if (i < g.lives) {
      ctx.fillStyle = '#ff4466';
      ctx.fillRect(x, y, 16, 16);
    } else {
      ctx.strokeStyle = '#ff4466';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, 14, 14);
    }
  }

  // Meilleur score
  ctx.font = 'bold 11px monospace';
  ctx.fillStyle = '#cccccc';
  ctx.fillText('Meilleur : $ ' + s.best, 16, 84 + oy);

  // Gain récent sous le message "Livré !" (draw-mission-hud s'arrête à y=88)
  if (GAME.missionState.state === 'done' && s.lastGain > 0) {
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#66ff99';
    ctx.textAlign = 'center';
    ctx.fillText('+ $ ' + s.lastGain, cam.w / 2, 94);
  }

  // Jauge d'arrestation (visible seulement si > 0)
  if (g.arrestMeter > 0) {
    var barW = 140;
    var barX = (cam.w - barW) / 2;
    var labelY = 146;
    var barY = 162;

    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#ff6666';
    ctx.textAlign = 'center';
    ctx.fillText('ARRESTATION', cam.w / 2, labelY);

    // Fond de barre
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(barX - 3, barY - 3, barW + 6, 16);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(barX, barY, barW, 10);

    // Remplissage
    var ratio = g.arrestMeter / cfg.arrestMax;
    if (ratio > 1) ratio = 1;
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(barX, barY, barW * ratio, 10);
  }

  ctx.restore();
};