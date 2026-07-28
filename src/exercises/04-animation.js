/**
 * ÉTAPE 4 — La boucle d'animation
 *
 * La scène est complète et éclairée, mais figée : `renderer.render()` n'est
 * appelé qu'une fois. À toi d'écrire la boucle qui redessine en continu.
 */
import * as THREE from 'three'

export function createScene(container) {
  const width = container.clientWidth
  const height = container.clientHeight

  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#0f1117')

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
  camera.position.set(4, 3, 5)
  camera.lookAt(0, 0.8, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  container.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
  const material = new THREE.MeshStandardMaterial({
    color: '#c084fc',
    roughness: 0.35,
    metalness: 0.1,
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.y = 1
  cube.castShadow = true
  scene.add(cube)

  const floorGeometry = new THREE.PlaneGeometry(12, 12)
  const floorMaterial = new THREE.MeshStandardMaterial({ color: '#1b1d25' })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  scene.add(new THREE.AmbientLight('#ffffff', 0.6))
  const sun = new THREE.DirectionalLight('#ffffff', 2.5)
  sun.position.set(3, 5, 2)
  sun.castShadow = true
  scene.add(sun)

  // ---------------------------------------------------------------- à toi ----

  // TODO 1 — Une horloge pour mesurer le temps entre deux images.
  //   → new THREE.Clock()
  const clock = null

  // On garde l'identifiant de la boucle pour pouvoir l'annuler plus bas.
  let frameId = null

  function animate() {
    // TODO 2 — Redemande une image au navigateur, et stocke son identifiant.
    //   → frameId = requestAnimationFrame(animate)

    // TODO 3 — Récupère le temps écoulé depuis l'image précédente, en secondes.
    //   → const delta = clock.getDelta()

    // TODO 4 — Fais tourner le cube. Multiplie TOUJOURS par delta, sinon la
    //   vitesse dépend du taux de rafraîchissement de l'écran.
    //   → cube.rotation.x += delta * 0.6
    //   → cube.rotation.y += delta * 0.9

    // TODO 5 — Bonus : fais-le flotter avec un sinus.
    //   clock.elapsedTime = secondes depuis le démarrage de l'horloge.
    //   → cube.position.y = 1 + Math.sin(clock.elapsedTime * 2) * 0.3

    // TODO 6 — Dessine l'image. À chaque tour de boucle, cette fois.
    //   → renderer.render(scene, camera)
  }

  // TODO 7 — Démarre la boucle.
  //   → animate()
  renderer.render(scene, camera) // ← supprime cette ligne, animate() la remplace

  // ---------------------------------------------------------------------------

  return {
    scene,
    camera,
    renderer,
    object: cube,
    dispose() {
      // TODO 8 — Annule la boucle. Sans ça, elle continue de tourner après la
      //   destruction de la scène et garde toute la mémoire 3D en vie.
      //   → cancelAnimationFrame(frameId)

      geometry.dispose()
      material.dispose()
      floorGeometry.dispose()
      floorMaterial.dispose()
      renderer.dispose()
    },
  }
}
