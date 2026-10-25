// kyvorex-city/js/render/draw-ground.js
// Rôle : aplat de sol (asphalte) sur tout l'écran
// Dépend de : GAME.config.colors, GAME.camera
// Expose : GAME.drawGround(ctx)

window.GAME = window.GAME || {};

GAME.drawGround = function (ctx) {
  var cam = GAME.camera;
  ctx.fillStyle = GAME.config.colors.asphalt;
  ctx.fillRect(0, 0, cam.w, cam.h);
};