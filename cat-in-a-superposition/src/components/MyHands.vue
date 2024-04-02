<script setup>
import CatCard from '@/components/CatCard.vue'
import { useGameStateStore } from '@/stores/gameState'

defineProps(['hands'])

const store = useGameStateStore()
</script>

<template>
<div class="hands">
  <div v-if="store.gameState.round < 4">
    <div v-for="(hand, index) in hands" v-bind:key="index">
      <CatCard style="card" :number="hand" />
    </div>
  </div>
</div>
</template>

<style>
.hands {
  text-align: center;
}

.hands div {
  display: inline-block;
}
</style>
