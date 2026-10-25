// kyvorex-city/js/render/draw-hud.js
// Rôle : HUD de debug (FPS + vitesse) en haut à gauche
// Dépend de : GAME.config, GAME.car
// Expose : GAME.drawHud(ctx, fps)

window.GAME = window.GAME || {};

GAME.drawHud = function (ctx, fps) {

  if (!GAME.config.debug.showHud) return;

  var col = GAME.config.colors;
  var vitesse = Math.round(Math.abs(GAME.car.speed));
  var texte = 'FPS ' + Math.round(fps) + '  |  ' + vitesse + ' km/h';

  ctx.save();
  ctx.font = 'bold 14px monospace';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  // Fond semi-transparent pour la lisibilité
  var largeur = ctx.measureText(texte).width + 16;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(8, 8, largeur, 24);

  ctx.fillStyle = col.hud;
  ctx.fillText(texte, 16, 14);

  ctx.restore();
};