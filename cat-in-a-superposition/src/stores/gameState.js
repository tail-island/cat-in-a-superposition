import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Game } from '@/models/game'
// import * as boldPlayer from '@/players/boldPlayer'
// import * as carefulPlayer from '@/players/carefulPlayer'
// import * as impatientPlayer from '@/players/impatientPlayer'
// import * as indecisivePlayer from '@/players/indecisivePlayer'

// const players = {
//   impatientPlayer,
//   indecisivePlayer,
//   boldPlayer,
//   carefulPlayer
// }

export const useGameStateStore = defineStore(
  'gameState',
  () => {
    const game = new Game()

    const gameState = ref(game.getNewState())
    const isGameEnd = ref(null)
    const actions = ref([])

    // const newGameState = async (enemyNames, seed) => {

    // }

    const nextGameState = action => {
      actions.value.push(`${gameState.value.actionPlayerIndex}: ${JSON.stringify(action)}`)

      gameState.value = game.getNextState(gameState.value, action)
      isGameEnd.value = game.isEnd(gameState.value)
    }

    const getLegalActions = () => {
      return game.getLegalActions(gameState.value)
    }

    return { gameState, isGameEnd, actions, nextGameState, getLegalActions }
  }
)
