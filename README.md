# Three.js — cinq exercices pour débuter

Un tuto **à trous** pour apprendre [Three.js](https://threejs.org), en Vue 3 + Vite.
Le code, c'est toi qui l'écris : chaque étape est un fichier rempli de `// TODO` à
compléter dans ton éditeur. L'app affiche le rendu de **ton** code, les consignes, et
une liste de vérifications qui te dit précisément ce qui manque.

## Démarrer

```bash
npm install
npm run dev
```

Ouvre http://localhost:5173, puis édite `src/exercises/01-scene.js`. À chaque
sauvegarde, la page se recharge et les vérifications se relancent.

## Le parcours

| # | Ce qu'on apprend | Fichier à compléter |
| --- | --- | --- |
| 1 | `Scene`, `PerspectiveCamera`, `WebGLRenderer` | [01-scene.js](src/exercises/01-scene.js) |
| 2 | `Geometry` + `Material` = `Mesh`, position / rotation / scale | [02-mesh.js](src/exercises/02-mesh.js) |
| 3 | `MeshStandardMaterial`, lumières, ombres | [03-lights.js](src/exercises/03-lights.js) |
| 4 | `requestAnimationFrame`, `Clock`, delta-time | [04-animation.js](src/exercises/04-animation.js) |
| 5 | `Raycaster` + `Plane` : glisser un objet à la souris | [05-mouse.js](src/exercises/05-mouse.js) |

Chaque exercice **part du code de l'étape précédente déjà écrit** : tu n'écris que la
nouvelle notion, jamais deux fois le même boilerplate.

Bloqué ? Le bouton « Solution » exécute la version de référence dans le même canvas,
et « Voir la solution » affiche son code. Les solutions complètes sont dans
[src/solutions/](src/solutions/).

## Le contrat

Chaque exercice exporte une seule fonction. L'app l'appelle avec un élément du DOM
déjà dimensionné, et se sert de l'objet retourné pour brancher le
redimensionnement, nettoyer la scène et lancer les vérifications :

```js
export function createScene(container) {
  // ... ton code ...

  return {
    scene,      // THREE.Scene
    camera,     // THREE.Camera
    renderer,   // THREE.WebGLRenderer
    object,     // l'objet principal (à partir de l'étape 2)
    dispose() { /* libère tout : boucle, géométries, matériaux, renderer */ },
  }
}
```

## Structure

```
src/
├── exercises/     ← tu travailles ici
├── solutions/     ← la version de référence de chaque étape
├── lessons/
│   └── steps.js   consignes, pièges, liens doc et vérifications de chaque étape
├── components/
│   ├── LessonView.vue      mise en page d'un exercice
│   ├── ExerciseRunner.vue  monte ton code et affiche les erreurs
│   ├── ChecklistPanel.vue  exécute les vérifications
│   └── CodeBlock.vue       affichage du code, coloration maison
└── lib/
    ├── format.js   coloration syntaxique et consignes en ligne
    └── testing.js  outils de correction (dont la simulation de souris)
```

## Les trois réflexes à garder

- Le code Three.js a besoin d'un élément réel du DOM : il tourne après le montage du
  composant, jamais avant.
- On nettoie dans `dispose()` : `cancelAnimationFrame()`, puis `.dispose()` sur les
  géométries, les matériaux et le renderer. Ces objets vivent sur la carte graphique,
  le garbage collector de JavaScript ne peut pas les libérer.
- On multiplie les animations par `delta` pour une vitesse identique quel que soit
  l'écran.

## Pour aller plus loin

- [Documentation officielle](https://threejs.org/docs/)
- [Three.js Journey](https://threejs-journey.com) — le cours de référence
- `OrbitControls` (`three/addons/controls/OrbitControls.js`) pour tourner autour de la scène
- `GLTFLoader` pour charger des modèles 3D créés dans Blender
