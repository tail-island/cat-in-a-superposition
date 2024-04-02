<script setup>
import { ref, watch } from 'vue'
import { useGameStateStore } from '../stores/gameState'

const store = useGameStateStore()
const actions = ref([])

async function selectAction (action) {
  await store.nextGameState(action)
}

watch(
  () => store.gameState,
  gameState => {
    if (gameState.actionPlayerIndex === 3) {
      actions.value = store.getLegalActions()
    }
  }
)
</script>

<template>
<div class="action-selector">
  <div v-if="store.gameState.actionPlayerIndex === 3">
    <div v-for="action of actions" v-bind:key="action" class="action" @click="selectAction(action)">
      {{ action }}
    </div>
  </div>
</div>
</template>

<style scoped>
.action-selector {
  border: 1px solid #808080;
  font-size: 12px;
  height: 250px;
  margin: 10px 10px 0px 10px;
  overflow-y: scroll;
}

.action {
  margin: 0px 8px;
  text-align: center;
}

.action:hover {
  background-color: #f0f0f0;
}
</style>
