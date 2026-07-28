<script setup>
import { computed, ref } from 'vue'
import { inlineCode } from '../lib/format.js'

const props = defineProps({
  todos: { type: Array, required: true },
  stepId: { type: String, required: true },
})

// L'échelle d'indices : on nomme d'abord le problème, puis l'API, puis la
// forme du code. La réponse avec ses valeurs est le cran de trop, celui qu'on
// ne prend que quand les autres n'ont pas suffi.
const LEVELS = ['Cadrage', 'Vocabulaire', 'Structure']

// Le fichier d'exercice est rechargé à chaque sauvegarde : la page repart de
// zéro. Sans stockage, il faudrait redéplier ses indices après chaque essai.
const STORAGE_KEY = 'threejs-tuto:hints'

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    // Stockage indisponible (navigation privée) : on tourne en mémoire.
    return {}
  }
}

const store = ref(readStore())

// Crans ouverts pour chaque TODO de l'étape : 0 = replié, hints.length = tous
// les indices, hints.length + 1 = réponse visible.
const opened = computed(() => store.value[props.stepId] ?? {})

const total = computed(() =>
  props.todos.reduce((sum, todo) => sum + todo.hints.length + 1, 0),
)

const spent = computed(() =>
  props.todos.reduce((sum, todo) => sum + level(todo), 0),
)

function level(todo) {
  return opened.value[todo.n] ?? 0
}

function answerShown(todo) {
  return level(todo) > todo.hints.length
}

function nextLabel(todo) {
  const next = level(todo) + 1
  if (next > todo.hints.length) return 'Révéler la réponse'
  return `Indice ${next} / ${todo.hints.length}`
}

function write(levels) {
  const next = { ...store.value, [props.stepId]: levels }
  store.value = next

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Idem : l'échec d'écriture ne doit pas casser la lecture des indices.
  }
}

function setLevel(todo, value) {
  write({ ...opened.value, [todo.n]: value })
}

function foldAll() {
  write({})
}
</script>

<template>
  <section class="ladder">
    <header class="ladder-head">
      <h3>À faire</h3>
      <span class="ladder-score" :class="{ 'is-quiet': spent === 0 }">
        {{ spent }} / {{ total }} indices
      </span>
    </header>

    <p class="ladder-intro">
      Un clic = un cran, du plus vague au plus précis. Arrête-toi dès que tu vois quoi écrire.
    </p>

    <ol class="ladder-items">
      <li v-for="todo in todos" :key="todo.n" :class="{ 'is-open': level(todo) > 0 }">
        <p class="ladder-row">
          <span class="ladder-badge">T{{ todo.n }}</span>
          <span class="ladder-label">{{ todo.label }}</span>
        </p>

        <div v-if="level(todo) > 0" class="ladder-hints">
          <p v-for="(hint, i) in todo.hints.slice(0, level(todo))" :key="i" class="ladder-hint">
            <span class="ladder-level">{{ LEVELS[i] ?? `Indice ${i + 1}` }}</span>
            <span v-html="inlineCode(hint)"></span>
          </p>

          <a
            v-if="todo.doc && level(todo) >= 2"
            class="ladder-doc"
            :href="todo.doc.url"
            target="_blank"
            rel="noopener"
          >
            {{ todo.doc.label }} ↗
          </a>

          <p v-if="answerShown(todo)" class="ladder-hint is-answer">
            <span class="ladder-level">Réponse</span>
            <span v-html="inlineCode(todo.answer)"></span>
          </p>
        </div>

        <p class="ladder-actions">
          <button
            v-if="!answerShown(todo)"
            class="ghost-button"
            :class="{ 'is-answer': level(todo) === todo.hints.length }"
            @click="setLevel(todo, level(todo) + 1)"
          >
            {{ nextLabel(todo) }}
          </button>

          <button v-if="level(todo) > 0" class="ladder-fold" @click="setLevel(todo, 0)">
            replier
          </button>
        </p>
      </li>
    </ol>

    <button v-if="spent > 0" class="ladder-fold" @click="foldAll">Tout replier</button>
  </section>
</template>
