// kyvorex-city/js/config-3d.js
// Rôle : réglages du monde en 3D (WebGL) : caméra, hauteurs, ombrage
// Dépend de : GAME.config (créé par config.js)
// Expose : GAME.config.render3d

window.GAME = window.GAME || {};

GAME.config.render3d = {
  enabled: true,        // false = on garde l'ancien affichage 2D
  cameraHeight: 800,    // hauteur de la caméra au-dessus du sol (plus grand = moins de perspective)

  sidewalkHeight: 6,    // hauteur du trottoir (bloc entier)
  interiorLift: 0.4,    // l'intérieur du bloc est à peine plus haut que le trottoir

  // Hauteur des maisons : heightMin + niveau * heightStep (niveau 0 à heightLevels-1)
  heightMin: 50,
  heightStep: 14,
  heightLevels: 5,

  // Ombrage (1 = couleur d'origine)
  wallBottomShade: 0.55,                           // bas des murs plus sombre
  faceShade: { n: 0.62, s: 0.78, e: 0.70, w: 0.55 }, // nord, sud, est, ouest
  roofLine: 0.6                                    // trait du toit : couleur du toit x ce facteur
};
