/**
 * ÉTAPE 5 — Déplacer un objet à la souris
 *
 * L'exercice final. La scène tourne, la caméra est en plongée sur la grille.
 * À toi d'écrire le glisser-déposer avec un Raycaster.
 *
 * L'idée : on lance un rayon depuis la caméra à travers le pixel survolé, et
 * on demande à Three.js ce qu'il traverse. Un canvas n'a pas de zones
 * cliquables comme le HTML : c'est la seule façon de cliquer sur un objet 3D.
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
  //   → const raycaster = new THREE.Raycaster()
  //   → const pointer = new THREE.Vector2()      // coordonnées souris normalisées
  //   → const dragPlane = new THREE.Plane()      // la surface de glissement
  //   → const planeNormal = new THREE.Vector3(0, 1, 0)  // plan horizontal
  //   → const hit = new THREE.Vector3()          // point d'intersection
  //   → const offset = new THREE.Vector3()       // écart clic ↔ centre du cube
  const raycaster = null
  const pointer = null
  const dragPlane = null
  const hit = null
  const offset = null

  let dragging = false
  let hovering = false

  // TODO 2 — Convertis les pixels de la souris en repère normalisé.
  //   Le raycaster attend des valeurs entre -1 et +1, avec le Y INVERSÉ par
  //   rapport au DOM. D'où le `* 2 - 1` et le signe négatif.
  //   → const rect = canvas.getBoundingClientRect()
  //   → pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  //   → pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  //   → raycaster.setFromCamera(pointer, camera)
  function updatePointer(event) {}

  function onPointerDown(event) {
    // TODO 3 — Mets à jour le rayon, puis teste s'il touche le cube.
    //   Si le clic est dans le vide, on ne fait rien.
    //   → updatePointer(event)
    //   → if (raycaster.intersectObject(cube).length === 0) return

    // TODO 4 — Définis le plan de glissement : horizontal, passant par le cube.
    //   → dragPlane.setFromNormalAndCoplanarPoint(planeNormal, cube.position)

    // TODO 5 — Mémorise l'écart entre le point cliqué et le centre du cube.
    //   Sans lui, le cube saute brutalement sous le curseur au premier clic.
    //   → if (raycaster.ray.intersectPlane(dragPlane, hit)) {
    //   →   offset.copy(hit).sub(cube.position)
    //   → } else {
    //   →   offset.set(0, 0, 0)
    //   → }

    // TODO 6 — Passe en mode glissement et capture le pointeur, pour que les
    //   évènements continuent d'arriver même si la souris sort du canvas.
    //   → dragging = true
    //   → canvas.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event) {
    // TODO 7 — Mets à jour le rayon à chaque mouvement.
    //   → updatePointer(event)

    // TODO 8 — Hors glissement, teste juste le survol pour changer le curseur.
    //   → if (!dragging) {
    //   →   hovering = raycaster.intersectObject(cube).length > 0
    //   →   canvas.style.cursor = hovering ? 'grab' : 'default'
    //   →   return
    //   → }

    // TODO 9 — En glissement : où le rayon croise-t-il le plan ? On y place le
    //   cube, sans oublier de retirer l'offset. Le clamp le garde sur la grille.
    //   → if (!raycaster.ray.intersectPlane(dragPlane, hit)) return
    //   → hit.sub(offset)
    //   → cube.position.x = THREE.MathUtils.clamp(hit.x, -LIMIT, LIMIT)
    //   → cube.position.z = THREE.MathUtils.clamp(hit.z, -LIMIT, LIMIT)
  }

  function onPointerUp(event) {
    // TODO 10 — Termine le glissement et relâche le pointeur.
    //   → if (!dragging) return
    //   → dragging = false
    //   → if (canvas.hasPointerCapture(event.pointerId)) {
    //   →   canvas.releasePointerCapture(event.pointerId)
    //   → }
  }

  // TODO 11 — Branche les trois écouteurs sur le canvas.
  //   → canvas.addEventListener('pointerdown', onPointerDown)
  //   → canvas.addEventListener('pointermove', onPointerMove)
  //   → canvas.addEventListener('pointerup', onPointerUp)
  //   → canvas.addEventListener('pointercancel', onPointerUp)

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

      // TODO 12 — Débranche les écouteurs que tu as ajoutés.
      //   → canvas.removeEventListener('pointerdown', onPointerDown)
      //   → ... et les trois autres.

      geometry.dispose()
      material.dispose()
      floorGeometry.dispose()
      floorMaterial.dispose()
      renderer.dispose()
    },
  }
}
