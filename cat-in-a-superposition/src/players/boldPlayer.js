// プレイヤーのサンプル（性格：大胆）

import { find, head, identity, map, reverse, sortBy, uniq } from 'ramda'

class RandomPlayer {
  beginGame (playerIndex) {
    console.error('1-999 ver 0.2') // 標準出力は通信で使用するので、標準エラー出力にログを出力します。受付番号やバージョンをログ出力しておけば、運営のミスを検出できる！

    this.playerIndex = playerIndex
  }

  discardHand (_board, players, _legalActions) {
    // 大胆なので、最も小さな手札を破棄します。
    return head(sortBy(identity, uniq(players[this.playerIndex].hands)))
  }

  predictWinsCount (board, players, legalActions) {
    // 大胆なので、最大の勝利数を予測します。
    return 3
  }

  declareObservedColor (_board, players, turn, ledColor, legalActions) {
    // パラドックスは受け入れます。
    if (legalActions.length === 1 && legalActions[0] === 'paradox') {
      return 'paradox'
    }

    const hands = reverse(sortBy(identity, uniq(players[this.playerIndex].hands)))

    if (turn === 0) {
      // 合法手の中から、最も数字が大きい手を選択します。
      return find(identity, map(hand => find(action => action.hand === hand, legalActions), hands))
    } else {
      // 基準色と同じで、最も数字が大きい手を選択します。
      let result = find(identity, map(hand => find(action => action.hand === hand && action.color === ledColor, legalActions), hands))

      // 見つからない場合は……
      if (!result) {
        // 合法手の中から、色が赤で、最も数字が大きい手を選択します。
        result = find(identity, map(hand => find(action => action.hand === hand && action.color === 'red', legalActions), hands))
      }

      // 見つからない場合は……
      if (!result) {
        // 負け確定なので、最も数字が小さい手を選択します。
        result = find(identity, map(hand => find(action => action.hand === hand, legalActions), reverse(hands)))
      }

      // リターン。
      return result
    }
  }

  getAction (board, players, turn, ledColor, legalActions) {
    switch (players[this.playerIndex].phase) {
      case 0:
        return this.discardHand(board, players, legalActions)

      case 1:
        return this.predictWinsCount(board, players, legalActions)

      case 2:
        return this.declareObservedColor(board, players, turn, ledColor, legalActions)
    }
  }

  observe (_board, _players, _turn, _ledColor, _actionPlayerIndex, _action) {
    // 本当はここで状態の推移を見て色々考えたい……。パラドックスしやすいうっかり屋とかの、敵の特性が分かるかもしれない。
  }

  endGame () {
    console.error('終了')
  }
}

export function createPlayer (_argv) {
  return new RandomPlayer()
}
