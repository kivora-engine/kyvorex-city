// kyvorex-city/js/police/police-graph.js
// Rôle : graphe des intersections + BFS sur la grille de routes
// Dépend de : GAME.config.city
// Expose : GAME.policeGraph (nearestIndex, centerOf, bfs)

window.GAME = window.GAME || {};

(function () {

  function nearestIndex(x, y) {
    var cc = GAME.config.city;
    var half = cc.roadWidth / 2;
    var i = Math.round((x - half) / cc.pitch);
    var j = Math.round((y - half) / cc.pitch);
    if (i < 0) i = 0; if (i > 5) i = 5;
    if (j < 0) j = 0; if (j > 5) j = 5;
    return { i: i, j: j };
  }

  function centerOf(i, j) {
    var cc = GAME.config.city;
    var half = cc.roadWidth / 2;
    return { x: half + i * cc.pitch, y: half + j * cc.pitch };
  }

  function bfs(from, to) {
    if (from.i === to.i && from.j === to.j) return [to];

    var key = function (i, j) { return i + ',' + j; };
    var visited = {};
    var parent = {};
    var queue = [{ i: from.i, j: from.j }];
    visited[key(from.i, from.j)] = true;

    var found = false;
    while (queue.length > 0 && !found) {
      var cur = queue.shift();
      var dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
      for (var k = 0; k < 4; k++) {
        var ni = cur.i + dirs[k][0];
        var nj = cur.j + dirs[k][1];
        if (ni < 0 || ni > 5 || nj < 0 || nj > 5) continue;
        var nk = key(ni, nj);
        if (visited[nk]) continue;
        visited[nk] = true;
        parent[nk] = { i: cur.i, j: cur.j };
        if (ni === to.i && nj === to.j) { found = true; break; }
        queue.push({ i: ni, j: nj });
      }
    }

    if (!found) return [from, to];

    var path = [];
    var node = { i: to.i, j: to.j };
    while (node) {
      path.unshift(node);
      if (node.i === from.i && node.j === from.j) break;
      node = parent[key(node.i, node.j)];
    }
    return path;
  }

  GAME.policeGraph = {
    nearestIndex: nearestIndex,
    centerOf: centerOf,
    bfs: bfs
  };
})();