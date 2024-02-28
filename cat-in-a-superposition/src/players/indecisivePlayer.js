// プレイヤーのサンプル（性格：優柔不断）

import { MersenneTwister19937, sample } from 'random-js'

class IndecisivePlayer {
  constructor (seed) {
    this.rng = seed != null ? MersenneTwister19937.seed(seed) : MersenneTwister19937.autoSeed()
  }

  beginGame (_name) {
    console.error('1-999 ver 0.1') // 標準出力は通信で使用するので、標準エラー出力にログを出力します。受付番号やバージョンをログ出力しておけば、運営のミスを検出できる！
  }

  getAction (_board, _players, _turn, _ledColor, legalActions) {
    // 優柔不断なのでどの手が良いのか選べなくて、ランダムで手を決定します。

    return sample(this.rng, legalActions, 1)[0]
  }

  observe (_board, _players, _turn, _ledColor) {
  }

  endGame () {
    console.error('終了')
  }
}

const player = new IndecisivePlayer(process.argv[3] != null ? parseInt(process.argv[3]) : null)

export function beginGame (name) {
  player.beginGame(name)
}

export function getAction (board, players, turn, ledColor, legalActions) {
  return player.getAction(board, players, turn, ledColor, legalActions)
}

export function observe (board, players, turn, ledColor) {
  return player.observe(board, players, turn, ledColor)
}

export function endGame () {
  player.endGame()
}
