// プレイヤーのサンプル（性格：せっかち）

class ImpatientPlayer {
  beginGame (playerIndex) {
    console.error('1-999 ver 0.0') // 標準出力は通信で使用するので、標準エラー出力にログを出力します。受付番号やバージョンをログ出力しておけば、運営のミスを検出できる！
    console.error('beginGame()')
    console.error({
      playerIndex
    })
  }

  getAction (board, players, turn, ledColor, legalActions) {
    console.error('getAction()')
    console.error({
      board,
      players,
      turn,
      ledColor,
      legalActions
    })

    // せっかちなので、どんな合法手があるのか調べもせずに、最初の合法手を選びます。

    return legalActions[0]
  }

  observe (board, players, turn, ledColor, actionPlayerIndex, action) {
    console.error('observe()')
    console.error({
      board,
      players,
      turn,
      ledColor,
      actionPlayerIndex,
      action
    })
  }

  endGame () {
    console.error('endGame()')
    console.error({})
    console.error('終了')
  }
}

export function createPlayer (_argv) {
  return new ImpatientPlayer()
}
