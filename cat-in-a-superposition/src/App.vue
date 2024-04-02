<script setup>
import { watch } from 'vue'
import GameTable from '@/components/GameTable.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import { useGameStateStore } from '@/stores/gameState'

const store = useGameStateStore()

watch(
  () => store.gameState,
  async gameState => {
    if (gameState.actionPlayerIndex === 3 || store.gameState.round === 4) {
      document.body.style.cursor = 'auto'
    } else {
      document.body.style.cursor = 'wait'

      await store.nextGameState(await store.getAction())
    }
  }
)
</script>

<template>
<div>
  <ControlPanel />
  <GameTable />
</div>
</template>

<style>
body {
  font-family: Arial;
  font-size: 14px;
}
</style>
