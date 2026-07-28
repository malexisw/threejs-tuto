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

  // L'horloge mesure le temps écoulé entre deux images.
  const clock = new THREE.Clock()
  let frameId = null

  function animate() {
    // On redemande une image au navigateur (~60 fois par seconde).
    frameId = requestAnimationFrame(animate)

    // delta = secondes écoulées depuis l'image précédente.
    const delta = clock.getDelta()

    // Multiplier par delta = même vitesse sur toutes les machines.
    cube.rotation.x += delta * 0.6
    cube.rotation.y += delta * 0.9

    // elapsedTime = secondes depuis le démarrage de l'horloge.
    cube.position.y = 1 + Math.sin(clock.elapsedTime * 2) * 0.3

    renderer.render(scene, camera)
  }

  animate()

  return {
    scene,
    camera,
    renderer,
    object: cube,
    dispose() {
      // Sans ça, la boucle continue de tourner après la destruction de la scène.
      cancelAnimationFrame(frameId)
      geometry.dispose()
      material.dispose()
      floorGeometry.dispose()
      floorMaterial.dispose()
      renderer.dispose()
    },
  }
}
