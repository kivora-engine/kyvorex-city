// kyvorex-city/js/debug-loader.js
// Rôle : charge l'outil de travail debug/grille.js uniquement en local (Acode, localhost, fichier)
// Dépend de : rien (fichier public ; ne fait rien sur le site en ligne github.io)
// Expose : rien

(function () {
  var h = window.location.hostname || '';
  // Site publié : on ne charge jamais l'outil de travail
  if (/github\.io$/.test(h) || /^kyvorex/.test(h)) return;

  var s = document.createElement('script');
  s.src = 'debug/grille.js';
  s.onerror = function () {}; // si le dossier debug/ est absent, on ignore en silence
  document.body.appendChild(s);
})();