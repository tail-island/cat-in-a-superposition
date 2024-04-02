// プレイヤーのサンプル（性格：慎重）

import { equals, filter, find, groupWith, head, identity, last, length, map, max, reduce, sort } from 'ramda'

class RandomPlayer {
  beginGame (playerIndex) {
    console.error('1-999 ver 0.3') // 標準出力は通信で使用するので、標準エラー出力にログを出力します。受付番号やバージョンをログ出力しておけば、運営のミスを検出できる！

    this.playerIndex = playerIndex
  }

  discardHand (_board, players, _legalActions) {
    // 慎重なので、一番枚数の多い手札の中で、有利なので他のプレイヤーが残したいだろう最も大きな手札を破棄します。

    const handGroups = groupWith(equals, players[this.playerIndex].hands)
    const maxGroupLength = reduce(max, 0, map(length, handGroups))

    return last(filter(handGroup => length(handGroup) === maxGroupLength, handGroups))[0]
  }

  predictWinsCount (board, players, legalActions) {
    // 慎重なので、最小の勝利数を予測します。

    return 1
  }

  declareObservedColor (_board, players, turn, ledColor, legalActions) {
    // パラドックスは受け入れます。
    if (legalActions.length === 1 && legalActions[0] === 'paradox') {
      return 'paradox'
    }

    // 枚数の多い順、枚数が同じ場合は数字の小さい順の手札のリストを作成します。
    const hands = map(
      head,
      sort(
        (handGroup1, handGroup2) => {
          if (length(handGroup1) > length(handGroup2)) {
            return -1
          }

          if (length(handGroup1) > length(handGroup2)) {
            return +1
          }

          return handGroup1[0] - handGroup2[0]
        },
        groupWith(
          equals,
          players[this.playerIndex].hands
        )
      )
    )

    if (turn === 0) {
      // 合法手の中から、同じ数字の枚数が多くて数字が小さい手を選択します。
      return find(identity, map(hand => find(action => action.hand === hand, legalActions), hands))
    } else {
      // 基準色と同じで、同じ数字の枚数が多くて数字が小さい手を選択します。
      let result = find(identity, map(hand => find(action => action.hand === hand && action.color === ledColor, legalActions), hands))

      if (!result) {
        // 合法手の中から、同じ数字の枚数が多くて数字が小さい手を選択します。
        result = find(identity, map(hand => find(action => action.hand === hand, legalActions), hands))
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

const player = new RandomPlayer()

export function beginGame (playerIndex) {
  player.beginGame(playerIndex)
}

export function getAction (board, players, turn, ledColor, legalActions) {
  return player.getAction(board, players, turn, ledColor, legalActions)
}

export function observe (board, players, turn, ledColor, actionPlayerIndex, action) {
  return player.observe(board, players, turn, ledColor, actionPlayerIndex, action)
}

export function endGame () {
  player.endGame()
}
