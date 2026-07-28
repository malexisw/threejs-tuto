/**
 * Outils utilisés par les vérifications automatiques de chaque étape.
 * Rien de tout ça n'est nécessaire pour apprendre Three.js : c'est la
 * "correction" du tuto.
 */

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Signature d'un objet : position + rotation, pour détecter un mouvement.
export function snapshot(object) {
  return [...object.position.toArray(), ...object.rotation.toArray()]
}

export function hasMoved(before, after, epsilon = 1e-4) {
  return before.some((value, index) => Math.abs(value - after[index]) > epsilon)
}

/**
 * Monte une deuxième scène, invisible et jetable, à partir du même fichier.
 * Permet de tester un comportement destructeur (comme dispose()) sans casser
 * la scène affichée à l'écran.
 */
export async function withProbeScene(module, callback) {
  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;left:-9999px;top:0;width:320px;height:240px'
  document.body.appendChild(probe)

  let instance = null
  try {
    instance = module.createScene(probe)
    return await callback(instance)
  } finally {
    try {
      instance?.dispose?.()
    } catch {
      // Le probe est jetable : une erreur de nettoyage ne doit rien casser.
    }
    probe.remove()
  }
}

/**
 * Attend que le défilement de la page soit terminé.
 *
 * `window.scrollTo({ behavior: 'smooth' })` est animé : pendant l'animation, la
 * position du canvas à l'écran change à chaque image. Simuler un clic à ce
 * moment-là viserait une position déjà obsolète.
 */
export async function waitForScrollToSettle(timeout = 1200) {
  const deadline = performance.now() + timeout
  let last = null

  while (performance.now() < deadline) {
    const current = window.scrollY
    if (current === last) return
    last = current
    await wait(80)
  }
}

// Position du centre d'un objet 3D, en pixels *relatifs au canvas*.
// On ne stocke jamais de coordonnées absolues : la page peut défiler entre
// deux évènements simulés.
function objectOffset(canvas, camera, object) {
  const rect = canvas.getBoundingClientRect()
  const ndc = object.position.clone().project(camera)

  return {
    ox: ((ndc.x + 1) / 2) * rect.width,
    oy: ((1 - ndc.y) / 2) * rect.height,
  }
}

function firePointer(target, type, x, y) {
  target.dispatchEvent(
    new PointerEvent(type, {
      clientX: x,
      clientY: y,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      button: 0,
      buttons: type === 'pointerup' ? 0 : 1,
      bubbles: true,
      cancelable: true,
    }),
  )
}

/**
 * Simule un glisser-déposer à la souris.
 *
 * Les évènements sont synthétiques, donc leur `pointerId` n'existe pas vraiment :
 * on neutralise les méthodes de capture de pointeur le temps du test, sinon
 * `setPointerCapture()` lèverait une NotFoundError dans le code de l'exercice.
 */
export async function simulateDrag(canvas, camera, object, { fromOffset, dx = 90, dy = 60 } = {}) {
  const captureApi = {
    setPointerCapture: canvas.setPointerCapture,
    releasePointerCapture: canvas.releasePointerCapture,
    hasPointerCapture: canvas.hasPointerCapture,
  }
  canvas.setPointerCapture = () => {}
  canvas.releasePointerCapture = () => {}
  canvas.hasPointerCapture = () => true

  const start = fromOffset ?? objectOffset(canvas, camera, object)

  // Le rectangle du canvas est relu à chaque évènement, pour rester juste même
  // si la page défile entre-temps.
  const fire = (type, offsetX, offsetY) => {
    const rect = canvas.getBoundingClientRect()
    firePointer(canvas, type, rect.left + offsetX, rect.top + offsetY)
  }

  try {
    fire('pointerdown', start.ox, start.oy)
    await wait(32)
    fire('pointermove', start.ox + dx / 2, start.oy + dy / 2)
    await wait(32)
    fire('pointermove', start.ox + dx, start.oy + dy)
    await wait(32)
    fire('pointerup', start.ox + dx, start.oy + dy)
    await wait(32)
  } finally {
    Object.assign(canvas, captureApi)
  }
}

// Un coin du canvas, loin de l'objet : sert à vérifier qu'un clic dans le vide
// ne déclenche pas le déplacement.
export function emptyCorner() {
  return { ox: 12, oy: 12 }
}
