<script setup>
import GameTable from '@/components/GameTable.vue'
import { useGameStateStore } from '@/stores/gameState'

const store = useGameStateStore()

function nextGameState () {
  store.nextGameState(store.getLegalActions()[0])
}
</script>

<template>
<GameTable />
<button @click="nextGameState">Next</button>
</template>

<style>
body {
  font-family: Arial;
  font-size: 14px;
}
</style>
