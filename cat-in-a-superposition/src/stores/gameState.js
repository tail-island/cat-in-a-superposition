import { defineStore } from 'pinia'
import { lensPath, map, partial, range, set } from 'ramda'
import { ref } from 'vue'
import { Game } from '@/models/game'
import * as boldPlayer from '@/players/boldPlayer'
import * as carefulPlayer from '@/players/carefulPlayer'
import * as impatientPlayer from '@/players/impatientPlayer'
import * as indecisivePlayer from '@/players/indecisivePlayer'
import * as webSocketPlayer from '@/players/webSocketPlayer'

const players = {
  impatientPlayer: impatientPlayer.createPlayer,
  indecisivePlayer: indecisivePlayer.createPlayer,
  boldPlayer: boldPlayer.createPlayer,
  carefulPlayer: carefulPlayer.createPlayer,
  webSocketPlayer8001: partial(webSocketPlayer.createPlayer, [8001]),
  webSocketPlayer8002: partial(webSocketPlayer.createPlayer, [8002]),
  webSocketPlayer8003: partial(webSocketPlayer.createPlayer, [8003])
}

export const useGameStateStore = defineStore(
  'gameState',
  () => {
    const enemies = ref([])

    const game = new Game()

    const gameState = ref(null)
    const actions = ref(null)

    const newGameState = async (enemyNames) => {
      if (enemies.value.length > 0) {
        for (const enemy of enemies.value) {
          await enemy.endGame()
        }
      }

      enemies.value = map(enemyName => players[enemyName](), enemyNames)
      actions.value = []

      for (const [index, enemy] of enemies.value.entries()) {
        await enemy.beginGame(index)
      }

      gameState.value = game.getNewState()
    }

    const getAction = async () => {
      return await enemies.value[gameState.value.actionPlayerIndex].getAction(
        gameState.value.board,
        map(
          i => {
            if (i === gameState.value.actionPlayerIndex) {
              return gameState.value.players[i]
            } else {
              return set(lensPath(['hands']), null)(gameState.value.players[i])
            }
          },
          range(0, gameState.value.players.length)
        ),
        gameState.value.turn,
        gameState.value.ledColor,
        game.getLegalActions(gameState.value)
      )
    }

    const getLegalActions = () => {
      return game.getLegalActions(gameState.value)
    }

    const nextGameState = async action => {
      const actionPlayerIndex = gameState.value.actionPlayerIndex

      actions.value.push(`${actionPlayerIndex}: ${JSON.stringify(action)}`)

      const nextGameState = game.getNextState(gameState.value, action)

      for (const [index, enemy] of enemies.value.entries()) {
        await enemy.observe(
          nextGameState.board,
          map(
            i => {
              if (i === index) {
                return nextGameState.players[i]
              } else {
                return set(lensPath(['hands']), null)(nextGameState.players[i])
              }
            },
            range(0, nextGameState.players.length)
          ),
          nextGameState.turn,
          nextGameState.ledColor,
          actionPlayerIndex,
          action
        )
      }

      if (game.isEnd(nextGameState)) {
        for (const enemy of enemies.value) {
          await enemy.endGame()
        }

        enemies.value = []
      }

      gameState.value = nextGameState
    }

    return { gameState, actions, newGameState, getAction, getLegalActions, nextGameState }
  }
)
