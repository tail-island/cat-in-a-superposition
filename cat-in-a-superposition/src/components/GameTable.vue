<script setup>
import ActionLog from '@/components/ActionLog.vue'
import MyHands from '@/components/MyHands.vue'
import PlayerState from '@/components/PlayerState.vue'
import ResearchBoard from '@/components/ResearchBoard.vue'
import { useGameStateStore } from '@/stores/gameState'

const store = useGameStateStore()
</script>

<template>
<div class="tabletop">
  <div class="property">
    Round: {{ !store.isGameEnd ? store.gameState.round : '-' }}
  </div>
  <PlayerState v-for="player in store.gameState.players" v-bind:key="player.playerIndex" :player="player" :class="`player-${player.playerIndex}`" />
  <ResearchBoard class="research-board" :board="store.gameState.board" />
  <MyHands class="my-hands" :hands="store.gameState.players[3].hands" />
  <ActionLog class="action-log" />
</div>
</template>

<style scoped>
.tabletop {
  display: grid;
  grid-template-columns: 200px 100px 200px 100px 200px 200px;
  grid-template-rows: 200px 200px 200px 60px;
  margin: 0 auto;
  width: 1000px;
}

.property {
  grid-column: 1;
  grid-row: 1;
  margin: 10px;
}

.player-0 {
  grid-column: 5;
  grid-row: 2;
}

.player-1 {
  grid-column: 3;
  grid-row: 1;
}

.player-2 {
  grid-column: 1;
  grid-row: 2;
}

.player-3 {
  grid-column: 3;
  grid-row: 3;
}

.research-board {
  grid-column: 2 / 5;
  grid-row: 2;
}

.my-hands {
  grid-column: 1 / 6;
  grid-row: 4;
}

.action-log {
  grid-column: 6;
  grid-row: 1 / 2;
}
</style>
