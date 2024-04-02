<script setup>
defineProps(['number'])
</script>

<template>
<div class="card">
  <div class="number">{{ number }}</div>
</div>
</template>

<style scoped>
.card {
  border: 1px solid #808080;
  border-radius: 6px;
  height: 60px;
  position: relative;
  width: 60px;
}

.number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
