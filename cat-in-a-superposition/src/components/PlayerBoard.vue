<script setup>
defineProps(['colors', 'predictionOfWinsCount'])
</script>

<template>
<div class="player-board">
  <div class="red"    :class="{disabled: !colors.red}"   ></div>
  <div class="blue"   :class="{disabled: !colors.blue}"  ></div>
  <div class="yellow" :class="{disabled: !colors.yellow}"></div>
  <div class="green"  :class="{disabled: !colors.green}" ></div>
  <div class="prediction-of-wins-count">{{ predictionOfWinsCount }}</div>
</div>
</template>

<style scoped>
.player-board {
  border: 1px solid #808080;
  border-radius: 6px;
  display: grid;
  grid-template-columns: 10px 40px 10px;
  grid-template-rows: 10px 40px 10px;
  height: 60px;
  position: relative;
  width: 60px;
}

.red {
  background-color: #ff8080;
  border: 1px solid #800000;
  grid-column: 2;
  grid-row: 1;
}

.blue {
  background-color: #8080ff;
  border: 1px solid #000080;
  grid-column: 1;
  grid-row: 2;
}

.yellow {
  background-color: #ffff80;
  border: 1px solid #808000;
  grid-column: 2;
  grid-row: 3;
}

.green {
  background-color: #80ff00;
  border: 1px solid #008000;
  grid-column: 3;
  grid-row: 2;
}

.disabled {
  background-color: #ffffff;
}

.prediction-of-wins-count {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
