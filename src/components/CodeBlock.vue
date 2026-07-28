<script setup>
import { computed } from 'vue'
import { highlightJs } from '../lib/format.js'

const props = defineProps({
  code: { type: String, required: true },
  title: { type: String, default: 'Le code' },
})

const highlighted = computed(() => highlightJs(props.code))
</script>

<template>
  <section class="code-block">
    <header class="code-block-head">{{ title }}</header>
    <pre><code v-html="highlighted"></code></pre>
  </section>
</template>
