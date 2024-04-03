<script setup>
import { useGameStateStore } from '@/stores/gameState'

const store = useGameStateStore()

async function newGameState () {
  document.getElementById('new-game-button').disabled = true

  await store.newGameState([
    document.getElementById('player-0').value,
    document.getElementById('player-1').value,
    document.getElementById('player-2').value
  ])

  document.getElementById('new-game-button').disabled = false
}
</script>

<template>
<div class="control-panel">
  <select id="player-0">
    <option value="impatientPlayer">
      impatientPlayer
    </option>
    <option value="indecisivePlayer">
      indecisivePlayer
    </option>
    <option value="boldPlayer" selected>
      boldPlayer
    </option>
    <option value="carefulPlayer">
      carefulPlayer
    </option>
    <option value="webSocketPlayer8001">
      webSocketPlayer8001
    </option>
    <option value="webSocketPlayer8002">
      webSocketPlayer8002
    </option>
    <option value="webSocketPlayer8003">
      webSocketPlayer8003
    </option>
  </select>
  &nbsp;
  <select id="player-1">
    <option value="impatientPlayer">
      impatientPlayer
    </option>
    <option value="indecisivePlayer">
      indecisivePlayer
    </option>
    <option value="boldPlayer">
      boldPlayer
    </option>
    <option value="carefulPlayer" selected>
      carefulPlayer
    </option>
    <option value="webSocketPlayer8001">
      webSocketPlayer8001
    </option>
    <option value="webSocketPlayer8002">
      webSocketPlayer8002
    </option>
    <option value="webSocketPlayer8003">
      webSocketPlayer8003
    </option>
  </select>
  &nbsp;
  <select id="player-2">
    <option value="impatientPlayer">
      impatientPlayer
    </option>
    <option value="indecisivePlayer">
      indecisivePlayer
    </option>
    <option value="boldPlayer" selected>
      boldPlayer
    </option>
    <option value="carefulPlayer">
      carefulPlayer
    </option>
    <option value="webSocketPlayer8001">
      webSocketPlayer8001
    </option>
    <option value="webSocketPlayer8002">
      webSocketPlayer8002
    </option>
    <option value="webSocketPlayer8003">
      webSocketPlayer8003
    </option>
  </select>
  &nbsp;
  <button id='new-game-button' @click="newGameState">New Game</button>
</div>
</template>

<style scoped>
.control-panel {
  text-align: center;
  margin: 10px 0px;
  width: 100%;
}
</style>
