<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  module: { type: Object, required: true },
})

const emit = defineEmits(['ready'])

const host = ref(null)
const error = ref(null)
const runtimeError = ref(null)

let result = null

function resize() {
  if (!host.value || !result?.renderer) return

  const width = host.value.clientWidth
  const height = host.value.clientHeight
  if (!width || !height) return

  if (result.camera?.isPerspectiveCamera) {
    result.camera.aspect = width / height
    result.camera.updateProjectionMatrix()
  }
  result.renderer.setSize(width, height)

  // Utile pour les étapes 1 à 3, qui ne dessinent qu'une seule image.
  if (result.scene && result.camera) result.renderer.render(result.scene, result.camera)
}

// Une exception levée dans une boucle requestAnimationFrame n'est attrapable
// par aucun try/catch : on l'intercepte au niveau de la fenêtre.
function onWindowError(event) {
  if (!runtimeError.value) runtimeError.value = event.message
}

function fail(message) {
  error.value = message
  emit('ready', { result: null, container: host.value, canvas: null, error: message })
}

onMounted(() => {
  window.addEventListener('error', onWindowError)

  if (typeof props.module?.createScene !== 'function') {
    fail("Le fichier doit exporter une fonction `createScene(container)`.")
    return
  }

  try {
    result = props.module.createScene(host.value)
  } catch (thrown) {
    fail(`${thrown.name} : ${thrown.message}`)
    return
  }

  if (!result || typeof result !== 'object') {
    fail('`createScene()` doit retourner un objet `{ scene, camera, renderer, ... }`.')
    return
  }

  window.addEventListener('resize', resize)

  emit('ready', {
    result,
    module: props.module,
    container: host.value,
    canvas: result.renderer?.domElement ?? null,
    error: null,
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('error', onWindowError)
  window.removeEventListener('resize', resize)

  try {
    result?.dispose?.()
  } catch {
    // Un dispose() incomplet ne doit pas empêcher de changer d'étape.
  }

  // Filet de sécurité : si dispose() a oublié le canvas, on le retire quand même.
  if (host.value) host.value.replaceChildren()
  result = null
})
</script>

<template>
  <div class="runner">
    <div ref="host" class="canvas-host"></div>

    <div v-if="error" class="panel is-error">
      <strong>Le code n'a pas pu démarrer</strong>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="runtimeError" class="panel is-error">
      <strong>Erreur pendant l'exécution</strong>
      <p>{{ runtimeError }}</p>
    </div>
  </div>
</template>
