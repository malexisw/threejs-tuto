<script setup>
import { computed, ref, watch } from 'vue'
import ChecklistPanel from './ChecklistPanel.vue'
import CodeBlock from './CodeBlock.vue'
import ExerciseRunner from './ExerciseRunner.vue'
import { inlineCode } from '../lib/format.js'

const props = defineProps({
  step: { type: Object, required: true },
  index: { type: Number, required: true },
  total: { type: Number, required: true },
})

const mode = ref('exercise')
const showSolution = ref(false)
const context = ref(null)

const activeModule = computed(() =>
  mode.value === 'solution' ? props.step.solution : props.step.exercise,
)

// Remonter la scène à chaque changement d'étape ou de mode.
const runnerKey = computed(() => `${props.step.id}-${mode.value}`)

watch(runnerKey, () => {
  context.value = null
})

watch(
  () => props.step.id,
  () => {
    mode.value = 'exercise'
    showSolution.value = false
  },
)
</script>

<template>
  <article class="lesson">
    <header class="lesson-head">
      <p class="lesson-counter">Exercice {{ index + 1 }} / {{ total }}</p>
      <h2>{{ step.title }}</h2>
      <p class="lesson-goal">{{ step.goal }}</p>
    </header>

    <div class="lesson-body">
      <div class="lesson-viewport">
        <div class="mode-switch" role="group" aria-label="Code exécuté">
          <button :class="{ 'is-active': mode === 'exercise' }" @click="mode = 'exercise'">
            Mon code
          </button>
          <button :class="{ 'is-active': mode === 'solution' }" @click="mode = 'solution'">
            Solution
          </button>
        </div>

        <ExerciseRunner
          :key="runnerKey"
          :module="activeModule"
          @ready="context = $event"
        />

        <p class="lesson-hint">
          <template v-if="mode === 'exercise'">
            Ton fichier : <code>{{ step.file }}</code> — sauvegarde, la page se recharge.
          </template>
          <template v-else>
            Rendu de la solution de référence. Repasse sur « Mon code » pour reprendre.
          </template>
        </p>
      </div>

      <div class="lesson-notes">
        <h3>À savoir</h3>
        <p v-for="(paragraph, i) in step.brief" :key="i" v-html="inlineCode(paragraph)"></p>

        <h3>À faire</h3>
        <ol class="task-list">
          <li v-for="(task, i) in step.tasks" :key="i" v-html="inlineCode(task)"></li>
        </ol>

        <ChecklistPanel :checks="step.checks" :context="context" />

        <h3>Les pièges</h3>
        <ul>
          <li v-for="(tip, i) in step.tips" :key="i" v-html="inlineCode(tip)"></li>
        </ul>

        <h3>Documentation</h3>
        <ul class="doc-links">
          <li v-for="doc in step.docs" :key="doc.url">
            <a :href="doc.url" target="_blank" rel="noopener">{{ doc.label }} ↗</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="solution-zone">
      <button class="ghost-button" @click="showSolution = !showSolution">
        {{ showSolution ? 'Masquer la solution' : 'Voir la solution' }}
      </button>

      <CodeBlock v-if="showSolution" :code="step.source" :title="`solutions/${step.id}.js`" />
    </div>
  </article>
</template>
