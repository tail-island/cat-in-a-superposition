<script setup>
import { onMounted } from 'vue'
import { useGameStateStore } from '@/stores/gameState'

const store = useGameStateStore()

onMounted(() => {
  const observer = new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
      mutation.target.lastElementChild?.scrollIntoView(false)
    }
  })

  observer.observe(document.getElementById('action-log'), { childList: true })
})
</script>

<template>
<div id="action-log" class="action-log">
  <div v-for="(action, index) in store.actions" :key="index">{{ action }}</div>
</div>
</template>

<style scoped>
.action-log {
  border: 1px solid #808080;
  font-size: 12px;
  height: 400px;
  margin: 10px;
  overflow-y: scroll;
}
</style>
