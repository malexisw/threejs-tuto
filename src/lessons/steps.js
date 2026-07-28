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
    tasks: [
      'Crée la scène avec `new THREE.Scene()`.',
      'Crée la caméra : `new THREE.PerspectiveCamera(60, width / height, 0.1, 100)`.',
      'Place-la en `(4, 3, 5)` et fais-la regarder l\'origine avec `lookAt(0, 0, 0)`.',
      'Crée le renderer : `new THREE.WebGLRenderer({ antialias: true })`.',
      'Dimensionne-le, puis ajoute `renderer.domElement` au `container`.',
      'Ajoute un `GridHelper` et un `AxesHelper` à la scène.',
      'Appelle `renderer.render(scene, camera)`.',
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
    tasks: [
      'Crée la géométrie : `new THREE.BoxGeometry(1.5, 1.5, 1.5)`.',
      "Crée le matériau : `new THREE.MeshBasicMaterial({ color: '#c084fc' })`.",
      'Assemble les deux : `new THREE.Mesh(geometry, material)`.',
      'Pose le cube avec `position.set(0, 0.75, 0)` et tourne-le de `Math.PI / 5` sur Y.',
      'Ajoute-le à la scène avec `scene.add(cube)`.',
      'Appelle `renderer.render(scene, camera)`.',
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
    tasks: [
      'Active `renderer.shadowMap.enabled = true`.',
      'Remplace le `MeshBasicMaterial` par un `MeshStandardMaterial`.',
      'Mets `cube.castShadow = true`.',
      'Crée un sol : `PlaneGeometry(12, 12)`, couché avec `rotation.x = -Math.PI / 2`, et `receiveShadow = true`.',
      "Ajoute une `AmbientLight('#ffffff', 0.6)`.",
      "Ajoute une `DirectionalLight('#ffffff', 2.5)` en `(3, 5, 2)`, avec `castShadow = true`.",
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
    tasks: [
      'Crée une `new THREE.Clock()`.',
      'Dans `animate()`, appelle `frameId = requestAnimationFrame(animate)`.',
      'Récupère `const delta = clock.getDelta()`.',
      'Fais tourner le cube en multipliant par `delta`.',
      'Bonus : fais-le flotter avec `Math.sin(clock.elapsedTime * 2)`.',
      'Appelle `renderer.render(scene, camera)` à chaque tour, et supprime le rendu unique.',
      'Démarre la boucle avec `animate()`.',
      'Annule-la dans `dispose()` avec `cancelAnimationFrame(frameId)`.',
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
    tasks: [
      'Crée `Raycaster`, `Vector2`, `Plane` et les `Vector3` une seule fois, hors des gestionnaires.',
      'Écris `updatePointer()` : pixels → repère normalisé, puis `raycaster.setFromCamera()`.',
      'Dans `onPointerDown`, sors si `raycaster.intersectObject(cube)` est vide.',
      'Définis le plan de glissement avec `setFromNormalAndCoplanarPoint(planeNormal, cube.position)`.',
      "Mémorise l'`offset` entre le point cliqué et le centre du cube.",
      'Passe `dragging = true` et appelle `canvas.setPointerCapture(event.pointerId)`.',
      'Dans `onPointerMove`, gère le survol quand on ne glisse pas.',
      'En glissement, projette sur le plan et déplace le cube en `x` et `z`.',
      'Dans `onPointerUp`, sors du mode glissement et relâche le pointeur.',
      'Branche les écouteurs, et débranche-les dans `dispose()`.',
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
