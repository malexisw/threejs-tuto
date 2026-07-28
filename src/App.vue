<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import LessonView from './components/LessonView.vue'
import { steps } from './lessons/steps.js'

const current = ref(0)

const currentStep = computed(() => steps[current.value])
const progress = computed(() => ((current.value + 1) / steps.length) * 100)

function indexFromHash() {
  const id = window.location.hash.replace(/^#\/?/, '')
  const found = steps.findIndex((step) => step.id === id)
  return found === -1 ? 0 : found
}

// L'étape est mémorisée dans l'URL : éditer un fichier d'exercice provoque un
// rechargement complet de la page, et on veut revenir là où on en était.
onMounted(() => {
  current.value = indexFromHash()
  window.addEventListener('hashchange', () => {
    current.value = indexFromHash()
  })
})

watch(current, (index) => {
  const hash = `#${steps[index].id}`
  if (window.location.hash !== hash) window.location.hash = hash
})

function go(index) {
  current.value = index
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <header class="app-head">
    <p class="eyebrow">Three.js · exercices</p>
    <h1>De la scène vide au cube qu'on attrape</h1>
    <p class="tagline">
      Cinq exercices pour démarrer avec Three.js. Le code, c'est toi qui l'écris : chaque
      étape est un fichier rempli de <code>// TODO</code> à compléter dans ton éditeur. Le
      rendu se recharge à la sauvegarde, et les vérifications te disent ce qui manque.
    </p>

    <nav class="steps">
      <button
        v-for="(step, index) in steps"
        :key="step.id"
        class="step"
        :class="{ 'is-active': index === current, 'is-done': index < current }"
        @click="go(index)"
      >
        <span class="step-number">{{ index + 1 }}</span>
        {{ step.label }}
      </button>
    </nav>

    <div class="progress"><div class="progress-bar" :style="{ width: `${progress}%` }"></div></div>
  </header>

  <main class="app-main">
    <LessonView
      :key="currentStep.id"
      :step="currentStep"
      :index="current"
      :total="steps.length"
    />
  </main>

  <footer class="app-foot">
    <button class="ghost-button" :disabled="current === 0" @click="go(current - 1)">
      ← Exercice précédent
    </button>

    <span class="foot-count">{{ current + 1 }} / {{ steps.length }}</span>

    <button
      class="ghost-button is-primary"
      :disabled="current === steps.length - 1"
      @click="go(current + 1)"
    >
      Exercice suivant →
    </button>
  </footer>
</template>
