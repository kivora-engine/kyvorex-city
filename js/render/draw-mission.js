// kyvorex-city/js/render/draw-mission.js
// Rôle : marqueurs pulsants au sol (colis jaune / livraison verte)
// Dépend de : GAME.missionState, GAME.camera
// Expose : GAME.drawMission(ctx)

window.GAME = window.GAME || {};

(function () {

  function dessinerMarqueur(ctx, cam, pt, couleur, pulsation) {
    var rayon = 20 + pulsation * 10;
    var sx = pt.x - cam.x;
    var sy = pt.y - cam.y;

    // Culling : hors écran, on ne dessine pas
    if (sx + rayon < 0 || sx - rayon > cam.w) return;
    if (sy + rayon < 0 || sy - rayon > cam.h) return;

    // Halo extérieur
    ctx.beginPath();
    ctx.arc(sx, sy, rayon, 0, Math.PI * 2);
    ctx.fillStyle = couleur + '80'; // 50% alpha via hex
    ctx.fill();

    // Coeur
    ctx.beginPath();
    ctx.arc(sx, sy, rayon * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = couleur;
    ctx.fill();
  }

  GAME.drawMission = function (ctx) {
    var ms = GAME.missionState;
    var cam = GAME.camera;

    // Pulsation douce entre 0 et 1
    var pulsation = 0.5 + 0.5 * Math.sin(ms.pulse * 3);

    if (ms.state === 'pickup' && ms.pickupPt) {
      dessinerMarqueur(ctx, cam, ms.pickupPt, '#ffe066', pulsation);
    } else if (ms.state === 'delivery' && ms.deliveryPt) {
      dessinerMarqueur(ctx, cam, ms.deliveryPt, '#66ff99', pulsation);
    }
  };
})();