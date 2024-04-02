<script setup>
defineProps(['board'])
</script>

<template>
<div class="research-board">
  <table>
    <thead>
      <tr>
        <th>0</th>
        <th>1</th>
        <th>2</th>
        <th>3</th>
        <th>4</th>
        <th>5</th>
        <th>6</th>
        <th>7</th>
      </tr>
    </thead>
    <tbody>
      <tr class="red">
        <td v-for="(ownerIndex, index) of board.red"    v-bind:key="index">{{ ownerIndex ?? '-' }}</td>
      </tr>
      <tr class="blue">
        <td v-for="(ownerIndex, index) of board.blue"   v-bind:key="index">{{ ownerIndex ?? '-' }}</td>
      </tr>
      <tr class="yellow">
        <td v-for="(ownerIndex, index) of board.yellow" v-bind:key="index">{{ ownerIndex ?? '-' }}</td>
      </tr>
      <tr class="green">
        <td v-for="(ownerIndex, index) of board.green"  v-bind:key="index">{{ ownerIndex ?? '-' }}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<style scoped>
.research-board {
  border: 1px solid #808080;
  height: 100%;
  width: 100%;
}

.research-board table {
  height: 100%;
  table-layout: fixed;
  width: 100%;
}

.research-board th {
  font-weight: normal;
}

td {
  text-align: center;
}

tr.red {
  background-color: #ffd0d0;
}

tr.blue {
  background-color: #d0d0ff;
}

tr.yellow {
  background-color: #f0f0d0;
}

tr.green {
  background-color: #d0ffd0;
}
</style>
