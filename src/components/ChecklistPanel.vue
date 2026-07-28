<script setup>
import { computed, ref, watch } from 'vue'
import { inlineCode } from '../lib/format.js'
import { waitForScrollToSettle } from '../lib/testing.js'

const props = defineProps({
  checks: { type: Array, required: true },
  context: { type: Object, default: null },
})

const states = ref([])
const running = ref(false)

const passed = computed(() => states.value.filter((state) => state.status === 'pass').length)
const done = computed(
  () => !running.value && states.value.length > 0 && states.value.every((s) => s.status !== 'pending'),
)
const allPassed = computed(() => done.value && passed.value === props.checks.length)

function reset() {
  states.value = props.checks.map(() => ({ status: 'pending', detail: null }))
}

async function run() {
  if (running.value) return
  running.value = true
  reset()

  // Les vérifications de l'étape 5 simulent des clics à des coordonnées écran :
  // il faut que la page ait fini de défiler, sinon elles visent à côté.
  await waitForScrollToSettle()

  for (const [index, check] of props.checks.entries()) {
    states.value[index] = { status: 'running', detail: null }

    try {
      const ok = await check.test(props.context)
      states.value[index] = { status: ok ? 'pass' : 'fail', detail: null }
    } catch (thrown) {
      states.value[index] = {
        status: 'fail',
        detail: `${thrown.name} : ${thrown.message}`,
      }
    }
  }

  running.value = false
}

watch(
  () => props.context,
  (context) => {
    reset()
    if (context && !context.error) run()
  },
  { immediate: true },
)

const SYMBOLS = { pending: '·', running: '…', pass: '✓', fail: '✗' }
</script>

<template>
  <section class="checklist">
    <header class="checklist-head">
      <h3>Vérifications</h3>
      <span v-if="running" class="checklist-score">en cours…</span>
      <span v-else-if="done" class="checklist-score" :class="{ 'is-complete': allPassed }">
        {{ passed }} / {{ checks.length }}
      </span>
    </header>

    <p v-if="context?.error" class="checklist-blocked">
      Les vérifications attendent que le code démarre sans erreur.
    </p>

    <ol v-else class="checklist-items">
      <li
        v-for="(check, index) in checks"
        :key="check.label"
        :class="`is-${states[index]?.status ?? 'pending'}`"
      >
        <span class="checklist-mark">{{ SYMBOLS[states[index]?.status ?? 'pending'] }}</span>

        <div>
          <span v-html="inlineCode(check.label)"></span>

          <p
            v-if="states[index]?.status === 'fail' && check.hint"
            class="checklist-hint"
            v-html="inlineCode(check.hint)"
          ></p>

          <p v-if="states[index]?.detail" class="checklist-hint">{{ states[index].detail }}</p>
        </div>
      </li>
    </ol>

    <p v-if="allPassed" class="checklist-success">
      Étape validée. Passe à la suivante.
    </p>

    <button class="ghost-button" :disabled="running || !context" @click="run">
      Relancer les vérifications
    </button>
  </section>
</template>
