import * as THREE from 'three'

export function createScene(container) {
  const width = container.clientWidth
  const height = container.clientHeight

  // 1. La scène : le conteneur de tout ce qui existe en 3D.
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#0f1117')

  // 2. La caméra : notre point de vue sur la scène.
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
  camera.position.set(4, 3, 5)
  camera.lookAt(0, 0, 0)

  // 3. Le renderer : il dessine la scène dans un <canvas>.
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  // Des repères pour visualiser l'espace.
  scene.add(new THREE.GridHelper(10, 10, '#3a3d4a', '#22242c'))
  scene.add(new THREE.AxesHelper(2))

  // Une seule image suffit : rien ne bouge encore.
  renderer.render(scene, camera)

  return {
    scene,
    camera,
    renderer,
    dispose() {
      renderer.dispose()
    },
  }
}
