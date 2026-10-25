// kyvorex-city/js/game/save.js
// Rôle : lit et écrit le meilleur score (localStorage + try/catch)
// Dépend de : GAME.config.game.bestKey
// Expose : GAME.save (load, store)

window.GAME = window.GAME || {};

GAME.save = {

  load: function () {
    try {
      var v = localStorage.getItem(GAME.config.game.bestKey);
      var n = parseInt(v, 10);
      return isNaN(n) ? 0 : n;
    } catch (e) {
      return 0;
    }
  },

  store: function (valeur) {
    try {
      localStorage.setItem(GAME.config.game.bestKey, String(valeur));
    } catch (e) {
      // Stockage indisponible : on garde la valeur en mémoire seulement
    }
  }
};