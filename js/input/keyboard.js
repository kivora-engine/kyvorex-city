// kyvorex-city/js/input/keyboard.js
// Rôle : clavier (flèches + WASD) écrit dans GAME.input
// Dépend de : GAME.input (input-state.js)
// Expose : GAME.keyboard.init()

(function () {

  // Touche physique -> nom de commande
  var MAP = {
    ArrowLeft: 'left',   KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
    ArrowUp: 'gas',      KeyW: 'gas',
    ArrowDown: 'brake',  KeyS: 'brake'
  };

  function surTouche(e, valeur) {
    var nom = MAP[e.code];
    if (!nom) return;
    GAME.input[nom] = valeur;
    e.preventDefault(); // bloque le scroll des flèches
  }

  GAME.keyboard = {
    init: function () {
      window.addEventListener('keydown', function (e) { surTouche(e, true); });
      window.addEventListener('keyup', function (e) { surTouche(e, false); });
      // Perte de focus : on relâche tout
      window.addEventListener('blur', GAME.input.reset);
    }
  };
})();