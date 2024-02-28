// プレイヤーのサンプル（性格：せっかち）

class ImpatientPlayer {
  beginGame (name) {
    console.error('1-999 ver 0.0') // 標準出力は通信で使用するので、標準エラー出力にログを出力します。受付番号やバージョンをログ出力しておけば、運営のミスを検出できる！
    console.error('beginGame()')
    console.error(name)
  }

  getAction (board, players, turn, ledColor, legalActions) {
    console.error('getAction()')
    console.error(board)
    console.error(players)
    console.error(turn)
    console.error(ledColor)
    console.error(legalActions)

    // せっかちなので、どんな合法手があるのか調べもせずに、最初の合法手を選びます。

    return legalActions[0]
  }

  observe (board, players, turn, ledColor) {
    console.error('observe()')
    console.error(board)
    console.error(players)
    console.error(turn)
    console.error(ledColor)
  }

  endGame () {
    console.error('endGame()')
    console.error('終了')
  }
}

const player = new ImpatientPlayer()

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
