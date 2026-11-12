// kyvorex-city/js/render3d/sprite-art.js
// Rôle : dessine en code le catalogue des sprites (voitures civiles, camionnettes, ambulance, camion de pompiers, piétons, policier, joueur à pied)
// Dépend de : rien
// Expose : GAME.spriteArt (CELL, COLS, ROWS, kinds, index, size, build)

window.GAME = window.GAME || {};

(function () {

  var CELL = 64, COLS = 8, ROWS = 4;
  var kinds = [];       // noms, dans l'ordre des cases
  var size = {};        // côté du carré à l'écran, en pixels du monde

  var CARS = ['#2f6db5', '#e0b030', '#3a9a5b', '#8a8f98', '#7b3fa0', '#d8d8d8'];
  var PEDS = [
    { cloth: '#c0392b', hair: '#2a1d14' }, { cloth: '#2980b9', hair: '#d9b04a' },
    { cloth: '#27ae60', hair: '#5a3a22' }, { cloth: '#8e44ad', hair: '#1a1a1a' }
  ];

  function arrondi(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  // Véhicule vu de dessus, nez en haut : carrosserie, vitres, phares, feux arrière
  function vehicule(ctx, w, l, couleur) {
    ctx.fillStyle = couleur;
    arrondi(ctx, -w / 2, -l / 2, w, l, 6); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(-w / 2 + 2, -l / 2 + 6, 3, l - 12);
    ctx.fillRect(w / 2 - 5, -l / 2 + 6, 3, l - 12);
    ctx.fillStyle = '#1e2b38';
    ctx.fillRect(-w / 2 + 4, -l / 2 + 9, w - 8, 9);       // pare-brise
    ctx.fillRect(-w / 2 + 4, l / 2 - 15, w - 8, 7);       // lunette arrière
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(-w / 2 + 4, -l / 2 + 19, w - 8, l - 36); // toit
    ctx.fillStyle = '#ffe9a8';
    ctx.fillRect(-w / 2 + 2, -l / 2, 6, 3);
    ctx.fillRect(w / 2 - 8, -l / 2, 6, 3);
    ctx.fillStyle = '#ff3b30';
    ctx.fillRect(-w / 2 + 2, l / 2 - 3, 6, 3);
    ctx.fillRect(w / 2 - 8, l / 2 - 3, 6, 3);
  }

  function ambulance(ctx) {
    vehicule(ctx, 30, 58, '#f2f2f2');
    ctx.fillStyle = '#d0342c';
    ctx.fillRect(-15, -4, 30, 5);                                  // bande rouge
    ctx.fillRect(-2, 6, 4, 14); ctx.fillRect(-7, 11, 14, 4);       // croix
    ctx.fillStyle = '#2d6cff'; ctx.fillRect(-10, -17, 8, 4);       // gyrophares
    ctx.fillStyle = '#ff3b30'; ctx.fillRect(2, -17, 8, 4);
  }

  function pompiers(ctx) {
    vehicule(ctx, 32, 62, '#c0392b');
    ctx.fillStyle = '#c9ced4'; ctx.fillRect(-4, -14, 8, 40);       // échelle
    ctx.fillStyle = '#8a9099';
    for (var y = -12; y < 26; y += 6) ctx.fillRect(-4, y, 8, 1.5);
    ctx.fillStyle = '#f1c40f'; ctx.fillRect(-16, 2, 32, 3);        // bande jaune
    ctx.fillStyle = '#2d6cff'; ctx.fillRect(-10, -20, 8, 4);
    ctx.fillStyle = '#ff3b30'; ctx.fillRect(2, -20, 8, 4);
  }

  // Personnage vu de dessus (dessiné 2 fois plus grand dans la case) ; pas : -1, 0 ou 1
  function personne(ctx, cloth, hair, pas, cap) {
    var sw = pas * 5;
    ctx.fillStyle = '#1a1a1a';                                      // pieds
    ctx.beginPath(); ctx.ellipse(-4, 6 + sw, 3, 4, 0, 0, 6.3); ctx.fill();
    ctx.beginPath(); ctx.ellipse(4, 6 - sw, 3, 4, 0, 0, 6.3); ctx.fill();
    ctx.fillStyle = cloth;                                          // bras
    ctx.fillRect(-12, -3 - sw, 4, 9); ctx.fillRect(8, -3 + sw, 4, 9);
    ctx.beginPath(); ctx.ellipse(0, 0, 10, 6, 0, 0, 6.3); ctx.fill(); // épaules
    ctx.fillStyle = hair;
    ctx.beginPath(); ctx.arc(0, -1, 5.5, 0, 6.3); ctx.fill();      // tête
    if (cap) { ctx.fillStyle = '#000'; ctx.fillRect(-3, -8, 6, 2); }   // visière
  }

  function ajouter(nom, cote, dessin) {
    var i = kinds.length;
    kinds.push(nom);
    size[nom] = cote;
    GAME.spriteArt.draws[nom] = dessin;
    return i;
  }

  GAME.spriteArt = {
    CELL: CELL, COLS: COLS, ROWS: ROWS, kinds: kinds, size: size, draws: {}, index: {},

    // Dessine toutes les cases dans le canvas 2D fourni
    build: function (ctx) {
      for (var i = 0; i < kinds.length; i++) {
        ctx.save();
        ctx.translate((i % COLS) * CELL + CELL / 2, Math.floor(i / COLS) * CELL + CELL / 2);
        this.draws[kinds[i]](ctx);
        ctx.restore();
      }
    }
  };

  var k;
  CARS.forEach(function (c, i) { ajouter('car' + i, 64, function (ctx) { vehicule(ctx, 28, 48, c); }); });
  ajouter('van', 64, function (ctx) { vehicule(ctx, 30, 56, '#e8e8e8'); ctx.fillStyle = '#2d6cff'; ctx.fillRect(-15, 4, 30, 4); });
  ajouter('ambulance', 64, ambulance);
  ajouter('firetruck', 64, pompiers);
  PEDS.forEach(function (p, i) {
    for (k = 0; k < 3; k++) {
      (function (kk) {
        ajouter('ped' + i + (kk === 2 ? 's' : 'w' + kk), 32, function (ctx) {
          personne(ctx, p.cloth, p.hair, kk === 2 ? 0 : (kk === 0 ? -1 : 1), false);
        });
      })(k);
    }
  });
  [['cop', '#1f3a6e', '#14264a', true], ['hero', '#d94f3d', '#2a1d14', false]].forEach(function (d) {
    for (k = 0; k < 3; k++) {
      (function (kk) {
        ajouter(d[0] + (kk === 2 ? '_s' : '_w' + kk), 32, function (ctx) {
          personne(ctx, d[1], d[2], kk === 2 ? 0 : (kk === 0 ? -1 : 1), d[3]);
        });
      })(k);
    }
  });

  for (var n = 0; n < kinds.length; n++) GAME.spriteArt.index[kinds[n]] = n;
})();
