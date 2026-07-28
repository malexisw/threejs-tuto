import * as exercise01 from '../exercises/01-scene.js'
import * as exercise02 from '../exercises/02-mesh.js'
import * as exercise03 from '../exercises/03-lights.js'
import * as exercise04 from '../exercises/04-animation.js'
import * as exercise05 from '../exercises/05-mouse.js'

import * as solution01 from '../solutions/01-scene.js'
import * as solution02 from '../solutions/02-mesh.js'
import * as solution03 from '../solutions/03-lights.js'
import * as solution04 from '../solutions/04-animation.js'
import * as solution05 from '../solutions/05-mouse.js'

import source01 from '../solutions/01-scene.js?raw'
import source02 from '../solutions/02-mesh.js?raw'
import source03 from '../solutions/03-lights.js?raw'
import source04 from '../solutions/04-animation.js?raw'
import source05 from '../solutions/05-mouse.js?raw'

import {
  emptyCorner,
  hasMoved,
  simulateDrag,
  snapshot,
  wait,
  withProbeScene,
} from '../lib/testing.js'

const DOC = 'https://threejs.org/docs/#api/en'

export const steps = [
  {
    id: '01-scene',
    label: 'Scène',
    title: 'La scène, la caméra, le renderer',
    goal: "Le trio de base de Three.js. Sans ces trois objets, rien ne s'affiche.",
    file: 'src/exercises/01-scene.js',
    exercise: exercise01,
    solution: solution01,
    source: source01,
    brief: [
      'Trois objets à créer, toujours les mêmes : la `Scene` (l\'univers, où on `add()` tout ce qu\'on veut voir), la `PerspectiveCamera` (l\'œil, qui a une position et regarde un point) et le `WebGLRenderer` (le peintre, qui fabrique le `<canvas>`).',
      "Objectif visuel : une grille et trois axes colorés — X rouge (droite), Y vert (haut), Z bleu (vers nous).",
    ],
    todos: [
      {
        n: 1,
        label: 'La scène',
        hints: [
          "Avant de placer quoi que ce soit, il faut un endroit où le placer. Comment s'appelle cet espace en Three.js — celui sur lequel on appellera `add()` ?",
          'La classe `Scene`. Son constructeur ne prend aucun argument. Sa propriété `background` accepte une `Color`.',
          "Tu instancies la classe et tu gardes la référence dans `scene`. Le fond, c'est une propriété que tu assignes ensuite.",
        ],
        doc: { label: 'Scene', url: `${DOC}/scenes/Scene` },
        answer:
          "Crée la scène avec `new THREE.Scene()`, et le fond avec `scene.background = new THREE.Color('#0f1117')`.",
      },
      {
        n: 2,
        label: 'La caméra en perspective',
        hints: [
          "Quatre réglages définissent ce qu'une caméra voit : l'ouverture de l'objectif, la forme de l'image, et les deux distances entre lesquelles le monde est visible. Lesquels connais-tu déjà dans le fichier ?",
          '`PerspectiveCamera(fov, aspect, near, far)` — quatre nombres, dans cet ordre. Le ratio se calcule depuis `width` et `height`.',
          "Un fov entre 50 et 75 donne un rendu naturel. `near` doit être petit mais jamais 0. `far` juste assez grand pour contenir la scène : tout ce qui est au-delà est invisible.",
        ],
        doc: { label: 'PerspectiveCamera', url: `${DOC}/cameras/PerspectiveCamera` },
        answer: 'Crée la caméra : `new THREE.PerspectiveCamera(60, width / height, 0.1, 100)`.',
      },
      {
        n: 3,
        label: 'Placer et orienter la caméra',
        hints: [
          "Une caméra restée à l'origine et regardant vers -Z : qu'est-ce qu'elle a dans son champ ? Que faut-il changer pour voir la grille de trois-quarts, en plongée ?",
          "`position` est un `Vector3`, il a une méthode `set(x, y, z)`. Pour l'orientation, `lookAt(x, y, z)` directement sur la caméra.",
          "Recule sur Z, monte sur Y, décale sur X — puis vise l'origine. L'ordre compte : `lookAt` doit venir après le déplacement.",
        ],
        doc: { label: 'Object3D', url: `${DOC}/core/Object3D` },
        answer: "Place-la en `(4, 3, 5)` et fais-la regarder l'origine avec `lookAt(0, 0, 0)`.",
      },
      {
        n: 4,
        label: 'Le renderer',
        hints: [
          "Qui fabrique le `<canvas>` : toi dans le HTML, ou Three.js ? Et qu'est-ce qui produit les bords en escalier sur les arêtes du cube ?",
          "`WebGLRenderer`. Son constructeur prend un objet d'options, et l'antialiasing en est une — nommée `antialias`.",
        ],
        doc: { label: 'WebGLRenderer', url: `${DOC}/renderers/WebGLRenderer` },
        answer: 'Crée le renderer : `new THREE.WebGLRenderer({ antialias: true })`.',
      },
      {
        n: 5,
        label: 'Taille, densité de pixels, insertion',
        hints: [
          "Le renderer ne connaît ni la taille de ton conteneur, ni la densité de pixels de l'écran. Et son canvas n'est encore nulle part dans la page. Ça fait trois choses.",
          '`setSize(largeur, hauteur)`, `setPixelRatio(nombre)`, et le canvas est exposé par la propriété `domElement`. La densité de l\'écran, c\'est `window.devicePixelRatio`.',
          "Deux réglages sur le renderer, puis un `appendChild` de DOM classique. Plafonne la densité à 2 : au-delà, tu quadruples le nombre de pixels à calculer pour une différence invisible.",
        ],
        doc: { label: 'WebGLRenderer', url: `${DOC}/renderers/WebGLRenderer` },
        answer:
          'Appelle `setSize(width, height)`, `setPixelRatio(Math.min(window.devicePixelRatio, 2))`, puis `container.appendChild(renderer.domElement)`.',
      },
      {
        n: 6,
        label: 'Les repères visuels',
        hints: [
          "Sans repère, impossible de dire où est le sol ni dans quel sens vont les axes. Three.js fournit deux objets tout faits pour ça — cherche le mot « helper » dans la doc.",
          '`GridHelper` prend une taille et un nombre de divisions (plus deux couleurs en option). `AxesHelper` prend une longueur.',
          "Ce sont des `Object3D` comme les autres : tu instancies, tu passes à `scene.add()`. Pas besoin de garder la référence.",
        ],
        doc: { label: 'GridHelper', url: `${DOC}/helpers/GridHelper` },
        answer: 'Ajoute un `new THREE.GridHelper(10, 10)` et un `new THREE.AxesHelper(2)` à la scène.',
      },
      {
        n: 7,
        label: 'Dessiner une image',
        hints: [
          'Tout existe en mémoire. Qu\'est-ce qui manque pour qu\'un seul pixel s\'allume à l\'écran ?',
          '`renderer.render(...)` — deux arguments : quoi dessiner, et vu d\'où.',
        ],
        doc: { label: 'WebGLRenderer', url: `${DOC}/renderers/WebGLRenderer` },
        answer: 'Appelle `renderer.render(scene, camera)`.',
      },
    ],
    tips: [
      "Une caméra laissée en `(0, 0, 0)` regarde l'intérieur de la scène depuis son centre : l'image est vide. C'est la première chose à vérifier quand rien ne s'affiche.",
      "`setPixelRatio(Math.min(window.devicePixelRatio, 2))` évite une image floue sur écran Retina, sans exploser les performances.",
      "Tout ce code doit vivre dans une fonction appelée après le montage du composant : il a besoin d'un vrai élément du DOM pour mesurer sa taille.",
    ],
    docs: [
      { label: 'Scene', url: `${DOC}/scenes/Scene` },
      { label: 'PerspectiveCamera', url: `${DOC}/cameras/PerspectiveCamera` },
      { label: 'WebGLRenderer', url: `${DOC}/renderers/WebGLRenderer` },
    ],
    checks: [
      {
        label: 'La scène est bien une `THREE.Scene`',
        hint: 'Remplace `const scene = null` par `new THREE.Scene()`.',
        test: ({ result }) => result?.scene?.isScene === true,
      },
      {
        label: 'La caméra est une `PerspectiveCamera`',
        hint: 'Il manque `new THREE.PerspectiveCamera(60, width / height, 0.1, 100)`.',
        test: ({ result }) => result?.camera?.isPerspectiveCamera === true,
      },
      {
        label: "La caméra n'est pas restée à l'origine",
        hint: 'Ajoute `camera.position.set(4, 3, 5)` puis `camera.lookAt(0, 0, 0)`.',
        test: ({ result }) => (result?.camera?.position?.length() ?? 0) > 0.5,
      },
      {
        label: 'Le canvas du renderer est branché dans la page',
        hint: 'Il manque `container.appendChild(renderer.domElement)`.',
        test: ({ result, container }) =>
          result?.renderer?.domElement instanceof HTMLCanvasElement &&
          container.contains(result.renderer.domElement),
      },
      {
        label: 'Le canvas a la taille du conteneur',
        hint: 'Appelle `renderer.setSize(width, height)`.',
        test: ({ result, container }) => {
          const canvas = result?.renderer?.domElement
          if (!canvas) return false
          return Math.abs(canvas.getBoundingClientRect().width - container.clientWidth) < 2
        },
      },
      {
        label: 'Une image a été dessinée',
        hint: 'Termine par `renderer.render(scene, camera)`.',
        test: ({ result }) => (result?.renderer?.info?.render?.frame ?? 0) > 0,
      },
    ],
  },

  {
    id: '02-mesh',
    label: 'Objet',
    title: 'Afficher un objet : géométrie + matériau',
    goal: 'Créer un premier cube visible, et comprendre les deux briques de tout objet 3D.',
    file: 'src/exercises/02-mesh.js',
    exercise: exercise02,
    solution: solution02,
    source: source02,
    brief: [
      "Un objet 3D, c'est toujours deux choses : une **géométrie** (la forme, c'est-à-dire des sommets) et un **matériau** (l'apparence). Le `Mesh` assemble les deux, et c'est lui qu'on ajoute à la scène.",
      "`MeshBasicMaterial` affiche une couleur plate qui ignore totalement les lumières. Le cube va donc paraître découpé dans du carton — c'est voulu, on corrigera à l'étape 3.",
    ],
    todos: [
      {
        n: 1,
        label: 'La forme',
        hints: [
          "Une forme 3D, c'est une liste de sommets. Pour un cube, tu n'as pas à les écrire à la main : Three.js a une classe par forme primitive. Comment s'appelle une boîte, en anglais, dans une bibliothèque 3D ?",
          '`BoxGeometry(largeur, hauteur, profondeur)` — trois nombres.',
          "Un cube, c'est trois fois la même valeur. Garde la référence dans `geometry` : il faudra la libérer plus tard.",
        ],
        doc: { label: 'BoxGeometry', url: `${DOC}/geometries/BoxGeometry` },
        answer: 'Crée la géométrie : `new THREE.BoxGeometry(1.5, 1.5, 1.5)`.',
      },
      {
        n: 2,
        label: "L'apparence",
        hints: [
          'Parmi les matériaux de Three.js, lequel affiche sa couleur telle quelle, sans jamais consulter les lumières de la scène ? Son nom contient un mot qui veut dire « le plus simple possible ».',
          "`MeshBasicMaterial`, avec un objet d'options — la couleur s'appelle `color` et accepte une chaîne CSS.",
        ],
        doc: { label: 'MeshBasicMaterial', url: `${DOC}/materials/MeshBasicMaterial` },
        answer: "Crée le matériau : `new THREE.MeshBasicMaterial({ color: '#c084fc' })`.",
      },
      {
        n: 3,
        label: 'Le mesh',
        hints: [
          'Tu as la forme et tu as l\'apparence. Quel objet marie les deux — et dans quel ordre les reçoit-il ?',
          '`Mesh(geometry, material)`.',
        ],
        doc: { label: 'Mesh', url: `${DOC}/objects/Mesh` },
        answer: 'Assemble les deux : `new THREE.Mesh(geometry, material)`.',
      },
      {
        n: 4,
        label: 'Poser et pivoter',
        hints: [
          "Le centre d'un `BoxGeometry` est au milieu du cube, pas sous ses pieds. Si le centre est en `y = 0`, où se trouve sa face du bas ? De combien faut-il le remonter ?",
          '`position.set(x, y, z)` et `rotation.y`. Tout `Object3D` possède `position`, `rotation` et `scale`.',
          "Monte de la moitié de la hauteur. Pour la rotation, une fraction de `Math.PI` — souviens-toi que `Math.PI` radians valent 180°.",
        ],
        doc: { label: 'Object3D', url: `${DOC}/core/Object3D` },
        answer: 'Pose le cube avec `position.set(0, 0.75, 0)` et tourne-le de `Math.PI / 5` sur Y.',
      },
      {
        n: 5,
        label: 'Ajouter à la scène',
        hints: [
          'Le mesh existe côté JavaScript. Est-ce que le renderer sait pour autant qu\'il doit le dessiner ?',
          '`scene.add(objet)`.',
        ],
        answer: 'Ajoute-le à la scène avec `scene.add(cube)`.',
      },
      {
        n: 6,
        label: "Dessiner l'image",
        hints: ["Même règle qu'à l'étape 1 : le canvas reste vide tant que…"],
        answer: 'Appelle `renderer.render(scene, camera)`.',
      },
    ],
    tips: [
      'Tout `Object3D` possède `position`, `rotation` et `scale`. Les rotations sont en **radians**, pas en degrés — un demi-tour vaut `Math.PI`.',
      "Le cube est posé en `y = 0.75`, soit la moitié de sa hauteur : sinon son centre serait sur la grille et il s'y enfoncerait à moitié.",
      "Les géométries et matériaux vivent sur la carte graphique. Le garbage collector de JavaScript ne peut pas les libérer : on appelle `.dispose()` sur chacun quand la scène est détruite.",
    ],
    docs: [
      { label: 'BoxGeometry', url: `${DOC}/geometries/BoxGeometry` },
      { label: 'MeshBasicMaterial', url: `${DOC}/materials/MeshBasicMaterial` },
      { label: 'Mesh', url: `${DOC}/objects/Mesh` },
    ],
    checks: [
      {
        label: 'Un `Mesh` est retourné dans `object`',
        hint: 'Crée le cube avec `new THREE.Mesh(geometry, material)`.',
        test: ({ result }) => result?.object?.isMesh === true,
      },
      {
        label: 'Il a une géométrie et un matériau',
        hint: 'Un `Mesh` prend la géométrie en premier argument, le matériau en second.',
        test: ({ result }) =>
          result?.object?.geometry?.isBufferGeometry === true &&
          result?.object?.material?.isMaterial === true,
      },
      {
        label: 'Le cube a été ajouté à la scène',
        hint: "Un mesh qui n'est pas dans la scène n'existe pas : `scene.add(cube)`.",
        test: ({ result }) => result?.scene?.children?.includes(result.object) === true,
      },
      {
        label: 'Le cube est posé sur la grille, pas au centre',
        hint: 'Le centre du cube doit être à la moitié de sa hauteur : `position.set(0, 0.75, 0)`.',
        test: ({ result }) => (result?.object?.position?.y ?? 0) > 0.1,
      },
      {
        label: 'Une image a été dessinée',
        hint: 'Termine par `renderer.render(scene, camera)`.',
        test: ({ result }) => (result?.renderer?.info?.render?.frame ?? 0) > 0,
      },
    ],
  },

  {
    id: '03-lights',
    label: 'Lumière',
    title: 'Les lumières et les matériaux',
    goal: "Passer d'une couleur plate à un vrai volume, avec des ombres.",
    file: 'src/exercises/03-lights.js',
    exercise: exercise03,
    solution: solution03,
    source: source03,
    brief: [
      "`MeshStandardMaterial` a besoin d'une source de lumière. Utilisé dans une scène sans lumière, l'objet apparaît complètement **noir** — c'est l'erreur de débutant la plus fréquente avec Three.js.",
      "Deux lumières suffisent au début : l'`AmbientLight` éclaire tout uniformément (aucun relief, aucune ombre), la `DirectionalLight` joue le soleil et sculpte les faces.",
    ],
    todos: [
      {
        n: 1,
        label: 'Activer les ombres sur le renderer',
        hints: [
          'Les ombres se règlent à trois endroits différents : qui les calcule, qui les projette, qui les reçoit. Ce TODO est le premier des trois.',
          'Le renderer expose un objet `shadowMap`, qui contient un booléen `enabled`.',
        ],
        doc: { label: 'WebGLRenderer', url: `${DOC}/renderers/WebGLRenderer` },
        answer: 'Active `renderer.shadowMap.enabled = true`.',
      },
      {
        n: 2,
        label: 'Un matériau qui réagit à la lumière',
        hints: [
          "Quel matériau calcule sa couleur à partir des lumières de la scène — et devient donc totalement noir s'il n'y en a aucune ? Son nom évoque le rendu « standard » de l'industrie (PBR).",
          '`MeshStandardMaterial`. Trois options utiles ici : `color`, `roughness` et `metalness`.',
          "Même forme que le `MeshBasicMaterial` — un objet d'options — avec deux clés en plus. `roughness` bas = surface brillante, haut = surface mate.",
        ],
        doc: { label: 'MeshStandardMaterial', url: `${DOC}/materials/MeshStandardMaterial` },
        answer:
          "Remplace-le par `new THREE.MeshStandardMaterial({ color: '#c084fc', roughness: 0.35, metalness: 0.1 })`.",
      },
      {
        n: 3,
        label: "Le cube projette son ombre",
        hints: [
          'Deuxième des trois endroits : qui projette.',
          "`castShadow`, un booléen présent sur tout `Object3D`.",
        ],
        doc: { label: 'Object3D', url: `${DOC}/core/Object3D` },
        answer: 'Mets `cube.castShadow = true`.',
      },
      {
        n: 4,
        label: 'Le sol qui reçoit l\'ombre',
        hints: [
          "Une ombre projetée dans le vide ne se voit pas : il faut une surface. Quelle géométrie pour une surface plate — et dans quel sens est-elle orientée par défaut ?",
          '`PlaneGeometry(largeur, hauteur)` + un `MeshStandardMaterial` + un `Mesh`. Puis `rotation.x` pour le coucher, et `receiveShadow` — le troisième des trois réglages d\'ombre.',
          "Même triptyque que le cube. Un quart de tour sur X le couche ; le signe détermine si sa face visible regarde vers le haut ou vers le bas.",
        ],
        doc: { label: 'PlaneGeometry', url: `${DOC}/geometries/PlaneGeometry` },
        answer:
          'Crée un sol : `PlaneGeometry(12, 12)`, couché avec `rotation.x = -Math.PI / 2`, `receiveShadow = true`, puis `scene.add(floor)`.',
      },
      {
        n: 5,
        label: "La lumière d'ambiance",
        hints: [
          'Avec une seule lumière directionnelle, les faces opposées au soleil restent parfaitement noires — ce qui n\'arrive jamais dans la vraie vie. Quelle lumière remonte le niveau partout à la fois, sans créer aucun relief ?',
          '`AmbientLight(couleur, intensité)` — deux arguments.',
          "Instancie, ajoute à la scène. Intensité modeste : c'est un remplissage, pas la lumière principale.",
        ],
        doc: { label: 'AmbientLight', url: `${DOC}/lights/AmbientLight` },
        answer: "Ajoute une `new THREE.AmbientLight('#ffffff', 0.6)` à la scène.",
      },
      {
        n: 6,
        label: 'Le soleil',
        hints: [
          "Quelle lumière envoie des rayons tous parallèles, comme une source infiniment lointaine — et peut donc projeter une ombre nette ?",
          '`DirectionalLight(couleur, intensité)`, sa `position`, et son `castShadow`.',
          "Ce qui compte pour cette lumière, c'est la direction : sa position définit d'où viennent les rayons, et elle vise l'origine par défaut. Mets-la en hauteur et sur le côté pour que l'ombre soit oblique.",
        ],
        doc: { label: 'DirectionalLight', url: `${DOC}/lights/DirectionalLight` },
        answer:
          "Ajoute une `new THREE.DirectionalLight('#ffffff', 2.5)` en `(3, 5, 2)`, avec `castShadow = true`.",
      },
    ],
    tips: [
      "Les ombres coûtent cher, donc rien n'est activé par défaut. Il faut les trois : `shadowMap.enabled` sur le renderer, `castShadow` sur qui projette, `receiveShadow` sur qui reçoit.",
      "Un `PlaneGeometry` est vertical par défaut, face à la caméra. Pour en faire un sol, on le couche d'un quart de tour : `rotation.x = -Math.PI / 2`.",
      "`roughness` va de 0 (miroir) à 1 (mat). C'est le réglage qui change le plus l'aspect d'un matériau.",
    ],
    docs: [
      { label: 'MeshStandardMaterial', url: `${DOC}/materials/MeshStandardMaterial` },
      { label: 'DirectionalLight', url: `${DOC}/lights/DirectionalLight` },
      { label: 'AmbientLight', url: `${DOC}/lights/AmbientLight` },
    ],
    checks: [
      {
        label: 'Le cube utilise un `MeshStandardMaterial`',
        hint: '`MeshBasicMaterial` ignore les lumières : aucun relief possible avec lui.',
        test: ({ result }) => result?.object?.material?.isMeshStandardMaterial === true,
      },
      {
        label: 'La scène contient une lumière d\'ambiance',
        hint: "Ajoute `new THREE.AmbientLight('#ffffff', 0.6)` à la scène.",
        test: ({ result }) => result?.scene?.children?.some((child) => child.isAmbientLight) === true,
      },
      {
        label: 'La scène contient une lumière directionnelle',
        hint: "C'est elle qui crée le relief et les ombres.",
        test: ({ result }) =>
          result?.scene?.children?.some((child) => child.isDirectionalLight) === true,
      },
      {
        label: 'Un sol a été ajouté sous le cube',
        hint: 'Un `Mesh` avec une `PlaneGeometry`, couché à plat.',
        test: ({ result }) =>
          result?.scene?.children?.some(
            (child) => child.isMesh && child !== result.object && child.geometry?.type === 'PlaneGeometry',
          ) === true,
      },
      {
        label: 'Les ombres sont activées de bout en bout',
        hint: '`renderer.shadowMap.enabled`, `cube.castShadow`, `floor.receiveShadow` et `sun.castShadow`.',
        test: ({ result }) =>
          result?.renderer?.shadowMap?.enabled === true &&
          result?.object?.castShadow === true &&
          result?.scene?.children?.some((child) => child.isMesh && child.receiveShadow) === true &&
          result?.scene?.children?.some((child) => child.isLight && child.castShadow) === true,
      },
    ],
  },

  {
    id: '04-animation',
    label: 'Animation',
    title: "La boucle d'animation",
    goal: 'Faire bouger le cube en redessinant la scène image après image.',
    file: 'src/exercises/04-animation.js',
    exercise: exercise04,
    solution: solution04,
    source: source04,
    brief: [
      "Jusqu'ici on appelait `renderer.render()` une seule fois. Pour animer, il faut l'appeler en continu via `requestAnimationFrame`, qui synchronise le rendu avec le rafraîchissement de l'écran.",
      "`THREE.Clock` fournit `getDelta()` (le temps écoulé depuis l'image précédente) et `elapsedTime` (le temps depuis le démarrage). Ces deux valeurs sont la base de toute animation.",
    ],
    todos: [
      {
        n: 1,
        label: "L'horloge",
        hints: [
          "Pour qu'une animation aille à la même vitesse sur un écran 60 Hz et sur un 120 Hz, de quelle mesure as-tu besoin à chaque image ?",
          '`THREE.Clock`, sans argument. Elle démarre au moment où tu l\'instancies.',
        ],
        doc: { label: 'Clock', url: `${DOC}/core/Clock` },
        answer: 'Crée une `new THREE.Clock()`.',
      },
      {
        n: 2,
        label: "Redemander une image",
        hints: [
          "Qui décide du bon moment pour dessiner l'image suivante : toi avec un `setInterval`, ou le navigateur qui sait quand l'écran se rafraîchit ?",
          "`requestAnimationFrame(callback)` renvoie un identifiant d'annulation. Le callback à lui passer, c'est `animate` elle-même.",
          "Première ligne de la boucle : la fonction se réinscrit pour l'image suivante, et tu stockes l'identifiant retourné dans `frameId`.",
        ],
        doc: {
          label: 'requestAnimationFrame',
          url: 'https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame',
        },
        answer: 'Dans `animate()`, appelle `frameId = requestAnimationFrame(animate)`.',
      },
      {
        n: 3,
        label: "Le temps écoulé depuis l'image précédente",
        hints: [
          "L'horloge sait répondre à deux questions très différentes : « combien de temps depuis la dernière fois que je t'ai posé la question ? » et « combien de temps depuis ton démarrage ? ». Laquelle te donne l'écart entre deux images ?",
          '`clock.getDelta()` renvoie le temps écoulé depuis le dernier appel, en secondes. `clock.elapsedTime` (ou `getElapsedTime()`) renvoie le temps depuis le démarrage.',
          "Un seul appel à `getDelta()` par tour de boucle : il remet son compteur à zéro, donc deux appels dans la même image donneraient des valeurs fausses. Stocke le résultat dans une variable.",
        ],
        doc: { label: 'Clock', url: `${DOC}/core/Clock` },
        answer: 'Récupère `const delta = clock.getDelta()`.',
      },
      {
        n: 4,
        label: 'Faire tourner le cube',
        hints: [
          "Tu veux exprimer une vitesse, par exemple « un demi-tour par seconde ». Que multiplies-tu par quoi pour obtenir l'incrément à appliquer sur cette image-ci ?",
          '`cube.rotation.x` et `cube.rotation.y`, en radians. Avec `+=`, pas `=` : tu accumules.',
          'Vitesse en radians par seconde × le temps écoulé. Deux axes avec deux vitesses différentes rendent la rotation moins mécanique.',
        ],
        doc: { label: 'Object3D', url: `${DOC}/core/Object3D` },
        answer: 'Par exemple `cube.rotation.x += delta * 0.6` et `cube.rotation.y += delta * 0.9`.',
      },
      {
        n: 5,
        label: 'Bonus : le faire flotter',
        hints: [
          "Un va-et-vient régulier autour d'une hauteur de repos. Quelle fonction mathématique oscille entre -1 et +1 quand son argument grandit ? Et quel temps faut-il lui donner : l'écart entre deux images, ou le temps depuis le démarrage ?",
          '`Math.sin(...)` et `clock.elapsedTime`.',
          "Ici c'est `=`, pas `+=` : tu définis une hauteur absolue — hauteur de repos + sinus × amplitude. Le facteur à l'intérieur du sinus règle la fréquence, celui à l'extérieur l'amplitude.",
        ],
        doc: { label: 'Clock', url: `${DOC}/core/Clock` },
        answer: 'Fais-le flotter avec `cube.position.y = 1 + Math.sin(clock.elapsedTime * 2) * 0.3`.',
      },
      {
        n: 6,
        label: "Dessiner à chaque tour",
        hints: [
          "Où doit vivre l'appel au rendu, maintenant ? Et qu'advient-il de celui que l'étape précédente avait mis tout en bas ?",
          '`renderer.render(scene, camera)`, en dernière ligne de `animate()`.',
        ],
        answer:
          'Appelle `renderer.render(scene, camera)` à chaque tour, et supprime le rendu unique.',
      },
      {
        n: 7,
        label: 'Démarrer la boucle',
        hints: [
          "La fonction est écrite, mais une fonction écrite n'est pas une fonction appelée. Qui déclenche le premier tour ?",
        ],
        answer: 'Démarre la boucle avec `animate()`.',
      },
      {
        n: 8,
        label: 'Annuler la boucle',
        hints: [
          "Le composant est détruit, la scène jetée. Que fait la boucle pendant ce temps — et qu'est-ce qu'elle empêche le garbage collector de libérer, sachant qu'elle référence `scene`, `camera` et `renderer` ?",
          "`cancelAnimationFrame(identifiant)`, le pendant exact de `requestAnimationFrame`. C'est pour ça que `frameId` est déclaré hors de la boucle.",
        ],
        doc: {
          label: 'cancelAnimationFrame',
          url: 'https://developer.mozilla.org/fr/docs/Web/API/Window/cancelAnimationFrame',
        },
        answer: 'Annule-la dans `dispose()` avec `cancelAnimationFrame(frameId)`.',
      },
    ],
    tips: [
      "`cube.rotation.y += 0.01` tourne deux fois plus vite sur un écran 120 Hz que sur un 60 Hz. En multipliant par `delta`, la vitesse s'exprime en unités **par seconde** et devient identique partout.",
      "Une boucle `requestAnimationFrame` non annulée continue de tourner après la destruction du composant, en gardant une référence sur toute la scène. Garder le `frameId` et appeler `cancelAnimationFrame` n'est pas optionnel.",
      "Alternative : `renderer.setAnimationLoop(animate)`, qui gère l'annulation avec `setAnimationLoop(null)` et fonctionne aussi en VR.",
    ],
    docs: [
      { label: 'Clock', url: `${DOC}/core/Clock` },
      { label: 'requestAnimationFrame', url: 'https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame' },
    ],
    checks: [
      {
        label: 'La scène est redessinée en continu',
        hint: "Il manque `requestAnimationFrame(animate)` dans la boucle, ou l'appel initial à `animate()`.",
        async test({ result }) {
          const before = result?.renderer?.info?.render?.frame ?? 0
          await wait(500)
          const after = result?.renderer?.info?.render?.frame ?? 0
          return after - before > 2
        },
      },
      {
        label: 'Le cube bouge vraiment',
        hint: 'Modifie `cube.rotation` (et sa `position` pour le bonus) à chaque image.',
        async test({ result }) {
          if (!result?.object) return false
          const before = snapshot(result.object)
          await wait(320)
          return hasMoved(before, snapshot(result.object))
        },
      },
      {
        label: '`dispose()` annule bien la boucle',
        hint: 'Ajoute `cancelAnimationFrame(frameId)` dans `dispose()`, sinon la boucle survit à la scène.',
        // Testé sur une deuxième scène invisible, pour ne pas détruire celle
        // qui est affichée à l'écran.
        test: ({ module }) =>
          withProbeScene(module, async (instance) => {
            const start = instance.renderer?.info?.render?.frame ?? 0
            await wait(200)
            const beforeDispose = instance.renderer?.info?.render?.frame ?? 0

            // Sans boucle qui tourne, il n'y a rien à annuler : on ne peut pas
            // valider cette étape par défaut.
            if (beforeDispose - start < 2) return false

            instance.dispose?.()
            await wait(300)
            return (instance.renderer?.info?.render?.frame ?? 0) === beforeDispose
          }),
      },
    ],
  },

  {
    id: '05-mouse',
    label: 'Souris',
    title: 'Déplacer un objet à la souris',
    goal: "Le raycasting : traduire une position 2D à l'écran en position 3D dans la scène.",
    file: 'src/exercises/05-mouse.js',
    exercise: exercise05,
    solution: solution05,
    source: source05,
    brief: [
      "On lance un rayon depuis la caméra à travers le pixel survolé, et on demande à Three.js quels objets il traverse. C'est la seule façon de cliquer sur un objet 3D : un canvas n'a pas de zones cliquables comme le HTML.",
      "Deux conversions à enchaîner. **Pixels → repère normalisé** : le raycaster attend des valeurs entre `-1` et `+1`, avec le Y inversé par rapport au DOM. **Rayon → point 3D** : un rayon traverse une infinité de positions, il faut choisir une surface d'arrivée — ici un `Plane` horizontal passant par le cube, donc le cube glisse sur la grille.",
    ],
    todos: [
      {
        n: 1,
        label: 'Les outils du glisser-déposer',
        hints: [
          "Six objets à créer une fois pour toutes. Pourquoi ici, et surtout pas dans le gestionnaire de `pointermove` ?",
          'Un `Raycaster`, un `Vector2` (la souris en repère normalisé), un `Plane` (la surface de glissement) et trois `Vector3` : la normale du plan, le point d\'intersection, l\'écart au centre du cube.',
          "Tous ces constructeurs se passent d'arguments, sauf la normale : celle d'un plan horizontal pointe vers le haut. Le `Plane` reste vide pour l'instant, on le définira au moment du clic.",
        ],
        doc: { label: 'Raycaster', url: `${DOC}/core/Raycaster` },
        answer:
          "Crée `new THREE.Raycaster()`, `new THREE.Vector2()`, `new THREE.Plane()`, `new THREE.Vector3(0, 1, 0)` pour la normale, et deux `new THREE.Vector3()` pour le point touché et l'écart.",
      },
      {
        n: 2,
        label: 'Pixels → repère normalisé',
        hints: [
          "L'évènement te donne des pixels comptés depuis le coin haut-gauche de la fenêtre. Le raycaster veut deux nombres entre -1 et +1, centrés au milieu du canvas, avec Y vers le haut. Écris la conversion sur papier avant de coder.",
          '`canvas.getBoundingClientRect()` te donne la position et la taille du canvas, `event.clientX` / `event.clientY` la souris. Pour orienter le rayon : `raycaster.setFromCamera(pointer, camera)`.',
          "Pour X : la position dans le canvas divisée par sa largeur donne 0→1 ; il te faut -1→+1. Pour Y, la même chose, avec le sens inversé. Puis `setFromCamera` à la fin.",
        ],
        doc: { label: 'Raycaster', url: `${DOC}/core/Raycaster` },
        answer:
          "`pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1`, `pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1`, puis `raycaster.setFromCamera(pointer, camera)`.",
      },
      {
        n: 3,
        label: 'Le clic touche-t-il le cube ?',
        hints: [
          "Comment demander à Three.js « ce rayon rencontre-t-il cet objet ? » — et que vaut la réponse quand il ne rencontre rien ?",
          '`raycaster.intersectObject(objet)` renvoie un tableau, trié du plus proche au plus lointain.',
          "Le rayon est déjà orienté par la fonction du TODO 2. Tableau vide → `return` immédiat, il n'y a rien à déplacer.",
        ],
        doc: { label: 'Raycaster', url: `${DOC}/core/Raycaster` },
        answer: 'Sors de la fonction si `raycaster.intersectObject(cube).length === 0`.',
      },
      {
        n: 4,
        label: 'Le plan de glissement',
        hints: [
          "Un rayon traverse une infinité de points de l'espace. Pour en tirer UNE position 3D, il faut une surface d'arrivée. Laquelle donne un glissement horizontal, à la hauteur actuelle du cube ?",
          '`Plane` a une méthode `setFromNormalAndCoplanarPoint(normale, point)`.',
          "La normale est déjà créée au TODO 1 (verticale). Le point coplanaire, c'est la position actuelle du cube : le plan passe donc par lui.",
        ],
        doc: { label: 'Plane', url: `${DOC}/math/Plane` },
        answer: 'Appelle `dragPlane.setFromNormalAndCoplanarPoint(planeNormal, cube.position)`.',
      },
      {
        n: 5,
        label: "L'écart entre le clic et le centre",
        hints: [
          "Tu cliques sur le coin du cube. Si tu places ensuite son centre exactement là où le rayon touche le plan, que se passe-t-il visuellement à l'instant du clic ?",
          '`raycaster.ray.intersectPlane(plan, cible)` écrit le point dans `cible` et renvoie `null` quand il n\'y a pas d\'intersection. Côté vecteurs : `copy()`, `sub()`, `set()`.',
          "Point touché moins centre du cube = l'écart à conserver. Et si l'intersection échoue (rayon parallèle au plan), écart nul plutôt qu'un vecteur périmé.",
        ],
        doc: { label: 'Ray', url: `${DOC}/math/Ray` },
        answer:
          "Avec `const intersection = raycaster.ray.intersectPlane(dragPlane, hit)` : si elle existe, `offset.copy(hit).sub(cube.position)` ; sinon `offset.set(0, 0, 0)`.",
      },
      {
        n: 6,
        label: 'Entrer en mode glissement',
        hints: [
          "Deux choses ici : un état à mémoriser, et un problème DOM — que se passe-t-il si la souris sort du canvas alors que le bouton est encore enfoncé ?",
          "Un booléen à passer à `true`, et `canvas.setPointerCapture(event.pointerId)` : le canvas devient la cible de tous les évènements de ce pointeur jusqu'au relâchement.",
        ],
        doc: {
          label: 'setPointerCapture',
          url: 'https://developer.mozilla.org/fr/docs/Web/API/Element/setPointerCapture',
        },
        answer: 'Passe `dragging = true` et appelle `canvas.setPointerCapture(event.pointerId)`.',
      },
      {
        n: 7,
        label: 'Rafraîchir le rayon',
        hints: [
          'À chaque mouvement de souris, quelle information est devenue obsolète ?',
          'La fonction que tu as écrite au TODO 2 fait déjà tout le travail.',
        ],
        answer: 'Appelle `updatePointer(event)` au début de `onPointerMove`.',
      },
      {
        n: 8,
        label: 'Le survol',
        hints: [
          "Hors glissement, à quoi sert encore le rayon ? Quel retour visuel attend l'utilisateur AVANT de cliquer, pour savoir que le cube est saisissable ?",
          '`raycaster.intersectObject(cube)` de nouveau, et `canvas.style.cursor` (`\'grab\'` / `\'default\'`).',
          "Si `dragging` est faux : mets `hovering` à jour, change le curseur, puis `return` — tout le reste de la fonction ne concerne que le glissement.",
        ],
        doc: { label: 'Raycaster', url: `${DOC}/core/Raycaster` },
        answer:
          "`hovering = raycaster.intersectObject(cube).length > 0`, `canvas.style.cursor = hovering ? 'grab' : 'default'`, puis `return`.",
      },
      {
        n: 9,
        label: 'Déplacer le cube',
        hints: [
          "Tu as un rayon, un plan et un écart mémorisé. Dans quel ordre les combiner pour obtenir la nouvelle position ? Et pourquoi ne toucher que X et Z ?",
          '`raycaster.ray.intersectPlane(dragPlane, hit)`, `Vector3.sub()`, et `THREE.MathUtils.clamp(valeur, min, max)` pour rester dans la grille.',
          "Intersection → retire l'écart → assigne `x` et `z`, chacun encadré par `LIMIT`. Si l'intersection échoue, sors sans rien changer plutôt que de déplacer le cube n'importe où.",
        ],
        doc: { label: 'MathUtils', url: `${DOC}/math/MathUtils` },
        answer:
          'Sors si `!raycaster.ray.intersectPlane(dragPlane, hit)`, puis `hit.sub(offset)` et `cube.position.x = THREE.MathUtils.clamp(hit.x, -LIMIT, LIMIT)` — idem pour `z`.',
      },
      {
        n: 10,
        label: 'Relâcher',
        hints: [
          "Le symétrique du TODO 6. Attention : cet évènement arrive aussi quand tu cliques sans avoir rien saisi.",
          '`canvas.hasPointerCapture(id)` pour savoir si la capture est encore active, `canvas.releasePointerCapture(id)` pour la rendre.',
          "Sors tôt si tu ne glissais pas. Sinon : état à `false`, curseur remis, et relâche la capture — seulement si elle est encore active, sinon le navigateur lève une erreur.",
        ],
        doc: {
          label: 'releasePointerCapture',
          url: 'https://developer.mozilla.org/fr/docs/Web/API/Element/releasePointerCapture',
        },
        answer:
          'Sors si `!dragging`, puis `dragging = false` et `canvas.releasePointerCapture(event.pointerId)` si `canvas.hasPointerCapture(event.pointerId)`.',
      },
      {
        n: 11,
        label: 'Brancher les écouteurs',
        hints: [
          "Quatre évènements pointeur. Trois sont évidents. Le quatrième arrive quand le navigateur ou le système interrompt le geste — comment doit-on le traiter, à ton avis ?",
          '`canvas.addEventListener(type, handler)` avec `pointerdown`, `pointermove`, `pointerup` et `pointercancel`.',
          "Quatre lignes. L'annulation n'a pas besoin de son propre gestionnaire : elle partage celui du relâchement.",
        ],
        doc: {
          label: 'Pointer events',
          url: 'https://developer.mozilla.org/fr/docs/Web/API/Pointer_events',
        },
        answer:
          'Branche `pointerdown`, `pointermove`, `pointerup` et `pointercancel` — ce dernier sur `onPointerUp`.',
      },
      {
        n: 12,
        label: 'Débrancher',
        hints: [
          "Pourquoi retirer des écouteurs posés sur un canvas qu'on va de toute façon jeter ? Réfléchis à ce que le canvas, lui, garde en vie.",
          '`removeEventListener(type, handler)` : même type, et surtout la même référence de fonction — une fonction anonyme ne peut pas être retirée.',
        ],
        answer:
          'Appelle `canvas.removeEventListener(...)` pour les quatre évènements, avec exactement les mêmes fonctions.',
      },
    ],
    tips: [
      "Sans l'`offset`, le cube se recentre brutalement sous le curseur au premier clic. C'est le détail qui sépare un drag correct d'un drag qui saute.",
      "Sans `setPointerCapture`, les évènements s'arrêtent dès que la souris sort du canvas et le cube reste collé au curseur.",
      "`canvas.style.touchAction = 'none'` est indispensable pour que le glissement fonctionne au doigt, sinon le navigateur scrolle la page.",
      "Pour déplacer la caméra plutôt qu'un objet, pas besoin de tout écrire : `import { OrbitControls } from 'three/addons/controls/OrbitControls.js'` fait le travail en trois lignes.",
    ],
    docs: [
      { label: 'Raycaster', url: `${DOC}/core/Raycaster` },
      { label: 'Plane', url: `${DOC}/math/Plane` },
      { label: 'OrbitControls', url: 'https://threejs.org/docs/#examples/en/controls/OrbitControls' },
    ],
    checks: [
      {
        label: 'Un glissement sur le cube le déplace',
        hint: "Le clic doit toucher le cube (`intersectObject`), puis le mouvement le repositionner sur le plan.",
        async test({ result, canvas }) {
          if (!result?.object || !canvas) return false
          const before = result.object.position.clone()
          await simulateDrag(canvas, result.camera, result.object)
          return before.distanceTo(result.object.position) > 0.2
        },
      },
      {
        label: 'Le cube reste sur son plan horizontal',
        hint: 'Ne modifie que `position.x` et `position.z` : le plan a pour normale `(0, 1, 0)`.',
        async test({ result, canvas }) {
          if (!result?.object || !canvas) return false
          const before = result.object.position.clone()
          await simulateDrag(canvas, result.camera, result.object, { dx: -70, dy: -40 })
          const after = result.object.position
          // Le déplacement doit avoir eu lieu, sinon un Y immobile ne prouve rien.
          if (before.distanceTo(after) < 0.2) return false
          return Math.abs(after.y - before.y) < 0.01
        },
      },
      {
        label: 'Un clic dans le vide ne déplace rien',
        hint: 'Si `raycaster.intersectObject(cube)` renvoie un tableau vide, il faut sortir de `onPointerDown`.',
        async test({ result, canvas }) {
          if (!result?.object || !canvas) return false

          // Contrôle : on vérifie d'abord qu'un vrai glissement fonctionne,
          // sinon « rien ne bouge » serait vrai pour un code encore vide.
          const start = result.object.position.clone()
          await simulateDrag(canvas, result.camera, result.object, { dx: 60, dy: 40 })
          if (start.distanceTo(result.object.position) < 0.2) return false

          const before = result.object.position.clone()
          await simulateDrag(canvas, result.camera, result.object, { fromOffset: emptyCorner() })
          return before.distanceTo(result.object.position) < 0.01
        },
      },
      {
        label: 'Le cube ne sort pas de la grille',
        hint: 'Encadre les positions avec `THREE.MathUtils.clamp(valeur, -4, 4)`.',
        async test({ result, canvas }) {
          if (!result?.object || !canvas) return false
          const rect = canvas.getBoundingClientRect()
          const before = result.object.position.clone()
          await simulateDrag(canvas, result.camera, result.object, {
            dx: rect.width,
            dy: rect.height,
          })
          if (before.distanceTo(result.object.position) < 0.2) return false
          const { x, z } = result.object.position
          return Math.abs(x) <= 4.001 && Math.abs(z) <= 4.001
        },
      },
    ],
  },
]
