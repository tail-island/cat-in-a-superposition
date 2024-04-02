<script setup>
import CatCard from '@/components/CatCard.vue'
import PlayerBoard from '@/components/PlayerBoard.vue'

defineProps(['player'])
</script>

<template>
  <div class="player">
    <div class="property-1">
      player-{{ player.playerIndex }}
    </div>
    <div class="property-2">
      score  {{ player.score }}
      win {{ player.winsCount }}
    </div>
    <PlayerBoard class="player-board" :colors="player.colors" :predictionOfWinsCount="player.predictionOfWinsCount ?? '-'" />
    <CatCard v-if="player?.action" :class="player.action.color" :number="player.action.hand" />
  </div>
</template>

<style scoped>
.player {
  display: grid;
  grid-template-columns: 60px 60px 60px;
  grid-template-rows: 60px 60px 60px;
  height: 180px;
  margin: 10px;
  width: 180px;
}

.property-1 {
  margin-right: 6px;
  grid-column: 1;
  grid-row: 1;
}

.property-2 {
  margin-left: 6px;
  grid-column: 3;
  grid-row: 1;
}

.red {
  grid-column: 2;
  grid-row: 1;
}

.blue {
  grid-column: 1;
  grid-row: 2;
}

.yellow {
  grid-column: 2;
  grid-row: 3;
}

.green {
  grid-column: 3;
  grid-row: 2;
}

.player-board {
  grid-column: 2;
  grid-row: 2;
}
</style>
