// kyvorex-city/js/render/draw-city.js
// Rôle : dessine routes, trottoirs et bâtiments (avec culling)
// Dépend de : GAME.config.city, GAME.world, GAME.camera
// Expose : GAME.drawCity(ctx)

window.GAME = window.GAME || {};

(function () {

  // --- Blocs (trottoir + intérieur) ---
  function drawBlocks(ctx, cam, cc, colors) {
    var bs = cc.blockSize;
    var sw = cc.sidewalk;
    var inner = bs - sw * 2;

    for (var by = 0; by < cc.blocksY; by++) {
      for (var bx = 0; bx < cc.blocksX; bx++) {
        var wx = cc.roadWidth + bx * cc.pitch;
        var wy = cc.roadWidth + by * cc.pitch;

        if (wx + bs < cam.x || wx > cam.x + cam.w) continue;
        if (wy + bs < cam.y || wy > cam.y + cam.h) continue;

        var sx = wx - cam.x;
        var sy = wy - cam.y;

        // Trottoir : tout le bloc
        ctx.fillStyle = colors.sidewalk;
        ctx.fillRect(sx, sy, bs, bs);

        // Intérieur du bloc (entre trottoir et bâtiments)
        ctx.fillStyle = colors.blockInterior;
        ctx.fillRect(sx + sw, sy + sw, inner, inner);
      }
    }
  }

  // --- Bâtiments (corps + contour + toit) ---
  function drawBuildings(ctx, cam, buildings, colors) {
    for (var i = 0; i < buildings.length; i++) {
      var b = buildings[i];
      if (b.x + b.w < cam.x || b.x > cam.x + cam.w) continue;
      if (b.y + b.h < cam.y || b.y > cam.y + cam.h) continue;

      var sx = b.x - cam.x;
      var sy = b.y - cam.y;

      // Corps
      ctx.fillStyle = b.color;
      ctx.fillRect(sx, sy, b.w, b.h);

      // Contour plus foncé
      ctx.strokeStyle = colors.buildingOutline;
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 1, sy + 1, b.w - 2, b.h - 2);

      // Toit : rectangle intérieur subtil
      var inset = Math.min(b.w, b.h) * 0.2;
      if (inset > 4) {
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(sx + inset, sy + inset, b.w - 2 * inset, b.h - 2 * inset);
      }
    }
  }

  // --- Ligne pointillée le long d'un segment (vertical ou horizontal) ---
  function drawDashesOnSegment(ctx, x1, y1, x2, y2, cam, color) {
    var dash = 16;
    var step = 40;
    ctx.fillStyle = color;

    if (x1 === x2) {
      // Segment vertical
      if (x1 < cam.x - 4 || x1 > cam.x + cam.w + 4) return;
      var yA = Math.max(y1, cam.y);
      var yB = Math.min(y2, cam.y + cam.h);
      if (yA >= yB) return;
      var sx = x1 - cam.x - 2;
      var y = y1 + Math.floor((yA - y1) / step) * step;
      while (y < yB) {
        var a = Math.max(y, yA);
        var b = Math.min(y + dash, yB);
        if (b > a) ctx.fillRect(sx, a - cam.y, 4, b - a);
        y += step;
      }
    } else {
      // Segment horizontal
      if (y1 < cam.y - 4 || y1 > cam.y + cam.h + 4) return;
      var xA = Math.max(x1, cam.x);
      var xB = Math.min(x2, cam.x + cam.w);
      if (xA >= xB) return;
      var sy = y1 - cam.y - 2;
      var x = x1 + Math.floor((xA - x1) / step) * step;
      while (x < xB) {
        var a2 = Math.max(x, xA);
        var b2 = Math.min(x + dash, xB);
        if (b2 > a2) ctx.fillRect(a2 - cam.x, sy, b2 - a2, 4);
        x += step;
      }
    }
  }

  // --- Toutes les lignes pointillées (culling par segment) ---
  function drawRoadLines(ctx, cam, cc, colors) {
    var i, j;
    var rw2 = cc.roadWidth / 2;

    // Routes verticales : 6 routes (indices 0..5)
    for (i = 0; i < 6; i++) {
      var xc = rw2 + i * cc.pitch;
      if (xc < cam.x - 4 || xc > cam.x + cam.w + 4) continue;
      for (j = 0; j < cc.blocksY; j++) {
        var y1 = cc.roadWidth + j * cc.pitch;
        var y2 = y1 + cc.blockSize;
        if (y2 < cam.y || y1 > cam.y + cam.h) continue;
        drawDashesOnSegment(ctx, xc, y1, xc, y2, cam, colors.roadLine);
      }
    }

    // Routes horizontales : 6 routes
    for (i = 0; i < 6; i++) {
      var yc = rw2 + i * cc.pitch;
      if (yc < cam.y - 4 || yc > cam.y + cam.h + 4) continue;
      for (j = 0; j < cc.blocksX; j++) {
        var x1 = cc.roadWidth + j * cc.pitch;
        var x2 = x1 + cc.blockSize;
        if (x2 < cam.x || x1 > cam.x + cam.w) continue;
        drawDashesOnSegment(ctx, x1, yc, x2, yc, cam, colors.roadLine);
      }
    }
  }

  GAME.drawCity = function (ctx) {
    var cam = GAME.camera;
    var world = GAME.world;
    var cc = GAME.config.city;
    var colors = GAME.config.colors;

    drawBlocks(ctx, cam, cc, colors);
    drawBuildings(ctx, cam, world.buildings, colors);
    drawRoadLines(ctx, cam, cc, colors);
  };
})();