/**
 * ÉTAPE 5 — Déplacer un objet à la souris
 *
 * L'exercice final. La scène tourne, la caméra est en plongée sur la grille.
 * À toi d'écrire le glisser-déposer avec un Raycaster.
 *
 * L'idée : on lance un rayon depuis la caméra à travers le pixel survolé, et
 * on demande à Three.js ce qu'il traverse. Un canvas n'a pas de zones
 * cliquables comme le HTML : c'est la seule façon de cliquer sur un objet 3D.
 *
 * Douze TODO, c'est beaucoup : le panneau « À faire » les reprend un par un et
 * ouvre un indice par clic, du cadrage à la réponse.
 */
import * as THREE from 'three'

const LIMIT = 4

export function createScene(container) {
  const width = container.clientWidth
  const height = container.clientHeight

  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#0f1117')

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
  camera.position.set(0, 6, 8)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true

  const canvas = renderer.domElement
  canvas.style.touchAction = 'none' // pour que ça marche aussi au doigt
  container.appendChild(canvas)

  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
  const material = new THREE.MeshStandardMaterial({
    color: '#c084fc',
    roughness: 0.35,
    metalness: 0.1,
    emissive: '#c084fc',
    emissiveIntensity: 0,
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(0, 0.75, 0)
  cube.castShadow = true
  scene.add(cube)

  const floorGeometry = new THREE.PlaneGeometry(12, 12)
  const floorMaterial = new THREE.MeshStandardMaterial({ color: '#1b1d25' })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  scene.add(new THREE.GridHelper(12, 12, '#3a3d4a', '#22242c'))
  scene.add(new THREE.AmbientLight('#ffffff', 0.6))

  const sun = new THREE.DirectionalLight('#ffffff', 2.5)
  sun.position.set(3, 6, 4)
  sun.castShadow = true
  scene.add(sun)

  // ---------------------------------------------------------------- à toi ----

  // TODO 1 — Les outils du glisser-déposer. On les crée UNE fois ici, jamais
  //   dans les gestionnaires d'évènements (qui tournent 60 fois par seconde).
  //   Il te faut : le lanceur de rayons, un vecteur 2D pour les coordonnées
  //   normalisées de la souris, le plan de glissement, sa normale (verticale,
  //   pour un plan horizontal), un vecteur pour le point d'intersection et un
  //   dernier pour l'écart entre le clic et le centre du cube.
  const raycaster = null
  const pointer = null
  const dragPlane = null
  const dragNormal = null
  const hit = null
  const offset = null

  let dragging = false
  let hovering = false

  // TODO 2 — Convertis la position de la souris (en pixels, relative au canvas)
  //   en repère normalisé : le raycaster attend des valeurs entre -1 et +1, avec
  //   le Y INVERSÉ par rapport au DOM. Termine en orientant le rayon depuis la
  //   caméra à travers ce point.
  function updatePointer(event) {}

  function onPointerDown(event) {
    // TODO 3 — Mets à jour le rayon, puis teste s'il touche le cube. Si le clic
    //   est dans le vide, on sort : il n'y a rien à déplacer.

    // TODO 4 — Définis le plan de glissement : horizontal, passant par le cube.

    // TODO 5 — Mémorise l'écart entre le point cliqué sur le plan et le centre
    //   du cube (et remets-le à zéro si le rayon ne croise pas le plan). Sans
    //   cet écart, le cube saute brutalement sous le curseur au premier clic.

    // TODO 6 — Passe en mode glissement et capture le pointeur, pour que les
    //   évènements continuent d'arriver même si la souris sort du canvas.
  }

  function onPointerMove(event) {
    // TODO 7 — Mets à jour le rayon à chaque mouvement.

    // TODO 8 — Hors glissement, teste juste le survol du cube pour changer le
    //   curseur (`hovering` sert aussi à le faire briller dans animate()), puis
    //   sors.

    // TODO 9 — En glissement : trouve où le rayon croise le plan, retire
    //   l'écart mémorisé, et place le cube là — en x et z seulement. Encadre les
    //   deux valeurs par LIMIT pour qu'il ne sorte pas de la grille.
  }

  function onPointerUp(event) {
    // TODO 10 — Sors du mode glissement et relâche la capture du pointeur (si
    //   elle est toujours active).
  }

  // TODO 11 — Branche les écouteurs de pointeur sur le canvas : appui,
  //   mouvement, relâchement, et l'annulation qui se traite comme un
  //   relâchement.

  // ---------------------------------------------------------------------------

  const clock = new THREE.Clock()
  let frameId = null

  function animate() {
    frameId = requestAnimationFrame(animate)

    const delta = clock.getDelta()
    if (!dragging) cube.rotation.y += delta * 0.4

    material.emissiveIntensity = hovering || dragging ? 0.35 : 0

    renderer.render(scene, camera)
  }

  animate()

  return {
    scene,
    camera,
    renderer,
    object: cube,
    dispose() {
      cancelAnimationFrame(frameId)

      // TODO 12 — Débranche les quatre écouteurs que tu as ajoutés.

      geometry.dispose()
      material.dispose()
      floorGeometry.dispose()
      floorMaterial.dispose()
      renderer.dispose()
    },
  }
}
