// kyvorex-city/js/render/draw-wanted-hud.js
// Rôle : jauge d'alerte en haut à droite (sous le chrono mission)
// Dépend de : GAME.wanted, GAME.config.police, GAME.camera
// Expose : GAME.drawWantedHud(ctx)

window.GAME = window.GAME || {};

GAME.drawWantedHud = function (ctx) {
  var cam = GAME.camera;
  var w = GAME.wanted;
  var c = GAME.config.police;

  var barW = 120;
  var barH = 12;
  var barX = cam.w - barW - 8;
  var barY = 95; // sous le chrono (y=8..52) et sous le message (y=58..88)

  ctx.save();
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';

  // Fond semi-transparent
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(barX - 4, barY - 4, barW + 8, 48);

  // Libellé
  ctx.font = 'bold 11px monospace';
  ctx.fillStyle = '#cccccc';
  ctx.fillText('ALERTE', cam.w - 8, barY);

  // Barre de fond
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(barX, barY + 14, barW, barH);

  // Remplissage
  var ratio = w.gauge / c.maxGauge;
  ctx.fillStyle = w.active ? '#ff4444' : '#ffcc44';
  ctx.fillRect(barX, barY + 14, barW * ratio, barH);

  // Texte "RECHERCHÉ !" clignotant quand la police est active
  if (w.active) {
    if (Math.floor(performance.now() / 300) % 2 === 0) {
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('RECHERCHÉ !', cam.w - 8, barY + 30);
    }
  }

  ctx.restore();
};