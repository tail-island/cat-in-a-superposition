import { __, always, all, any, ascend, chain, complement, compose, count, equals, filter, findIndex, identity, inc, isEmpty, isNil, last, lensPath, map, max, mergeLeft, modulo, over, pipe, range, remove, repeat, set, sort, splitEvery, uniq, zip, zipObj } from 'ramda'
import { MersenneTwister19937 } from 'random-js'
import { shuffle } from './utility.js'

export const COLORS = ['red', 'blue', 'yellow', 'green']

export class Game {
  // コンストラクター。
  constructor (seed = null) {
    this.rng = seed ? MersenneTwister19937.seed(seed) : MersenneTwister19937.autoSeed()
  }

  // 初期状態を取得します。
  getNewState () {
    return {
      board: zipObj(
        COLORS,
        repeat(
          repeat(null, 8),
          4
        )
      ),
      players: map(
        compose(
          mergeLeft(
            {
              score: 0,
              phase: 0,
              colors: zipObj(
                COLORS,
                repeat(true, 4)
              ),
              predictionOfWinsCount: null,
              winsCount: 0,
              action: null
            }
          ),
          zipObj(['playerIndex', 'hands'])
        ),
        zip(
          range(0, 4 + 1),
          map(
            sort(ascend(identity)),
            splitEvery(
              10,
              shuffle(
                this.rng,
                chain(
                  repeat(__, 5),
                  range(0, 8)
                )
              )
            )
          )
        )
      ),
      round: 0,
      turn: 0,
      actionPlayerIndex: 0,
      ledColor: null
    }
  }

  // 実行可能なアクションを取得します。
  getLegalActions (state) {
    const player = state.players[state.actionPlayerIndex]

    switch (player.phase) {
      // カードを廃棄します。
      case 0:
        return uniq(player.hands)

      // 勝利数を予測します。
      case 1:
        return [1, 2, 3]

      // 色を宣言してカードを置きます。
      default: {
        // 色を指定してアクションの集合を作成する関数です。
        const getActionsByColor = (color) => {
          if (!player.colors[color]) {
            return []
          }

          return map(
            zipObj(['color', 'hand']),
            zip(
              repeat(color, 8),
              filter(
                hand => isNil(state.board[color][hand]),
                uniq(player.hands)
              )
            )
          )
        }

        // 初手は、すでに出されていない限りは赤は使用不可。
        const disablesRed = state.turn === 0 && all(isNil, state.board.red)

        return (() => {
          // アクションの集合を作成します。
          let result = chain(
            getActionsByColor,
            filter(
              disablesRed ? complement(equals('red')) : always(true),
              COLORS
            )
          )

          // 他にアクションがないのであれば、赤のアクションを許可します。
          if (isEmpty(result) && disablesRed) {
            result = getActionsByColor('red')
          }

          // アクションが存在しない場合は、パラドックスしかできません。
          if (isEmpty(result)) {
            result = ['paradox']
          }

          // リターン。
          return result
        })()
      }
    }
  }

  // アクションを実行します。
  getNextState (state, action) {
    const actionPlayerIndex = state.actionPlayerIndex
    const player = state.players[actionPlayerIndex]

    // アクションを実行する関数です。
    const doAction = (() => {
      switch (player.phase) {
        // カードを1枚廃棄します。
        case 0:
          return over(
            lensPath(['players', actionPlayerIndex, 'hands']),
            hands => remove(findIndex(equals(action), hands), 1, hands)
          )

        // 勝利数を予測します。
        case 1:
          return set(
            lensPath(['players', actionPlayerIndex, 'predictionOfWinsCount']),
            action
          )

        // 色を宣言してカードを置きます。
        case 2:
          return state => {
            // 戻り値。
            let result = state

            // 最初に置かれた色を基準色に設定します。
            if (result.turn === 0) {
              result = set(
                lensPath(['ledColor']),
                action.color
              )(result)
            }

            // カードを手札から取り出します。
            result = over(
              lensPath(['players', actionPlayerIndex, 'hands']),
              hands => remove(findIndex(equals(action.hand), hands), 1, hands)
            )(result)

            // プレイヤー・トークンを置きます。
            result = set(
              lensPath(['board', action.color, action.hand]),
              actionPlayerIndex
            )(result)

            // 上でresultに設定した基準色と異なる色を使用した場合は、プレイヤー・ボードの基準色を☓にします。
            if (action.color !== result.ledColor) {
              result = set(
                lensPath(['players', actionPlayerIndex, 'colors', result.ledColor]),
                false
              )(result)
            }

            // アクションを保存します。
            result = set(
              lensPath(['players', actionPlayerIndex, 'action']),
              action
            )(result)

            // リターン。
            return result
          }
      }
    })()

    // ターンを終了する関数です。
    const endTurn = pipe(
      over(
        lensPath(player.phase < 2 ? ['players', actionPlayerIndex, 'phase'] : ['turn']),
        inc
      ),
      over(
        lensPath(['actionPlayerIndex']),
        compose(modulo(__, 4), inc)
      )
    )

    // トリックを終了する関数です。
    const endTrick = state => {
      // 戻り値。
      let result = state

      // プレイヤーの属性を初期化します。
      for (const i of range(0, 4)) {
        result = set(
          lensPath(['players', i, 'action']),
          null
        )(result)
      }

      // 属性を初期化します。
      result = pipe(
        set(lensPath(['turn']), 0),
        set(lensPath(['ledColor']), null)
      )(result)

      // リターン。
      return result
    }

    // パラドックスが発生しなかった場合向けの、トリックを終了する関数です。
    const endTrickWithoutParadox = state => {
      // 戻り値。
      let result = state

      // トリックの勝者を決定します。
      const winnerIndex = last(
        sort(
          compose(
            ([_playerIndex1, action1], [_playerIndex2, action2]) => {
              if (action1.color === action2.color) {
                return action1.hand - action2.hand
              }

              if (action1.color === 'red') {
                return +1
              }

              if (action2.color === 'red') {
                return -1
              }

              if (action1.color === state.ledColor) {
                return +1
              }

              if (action2.color === state.ledColor) {
                return -1
              }

              return 0 // 赤でも基準色でもない場合は、強さを比較しても意味はありません。
            }
          ),
          map(
            playerIndex => [playerIndex, state.players[playerIndex].action],
            range(0, 4)
          )
        )
      )[0]

      // 勝利数をインクリメントします。
      result = over(
        lensPath(['players', winnerIndex, 'winsCount']),
        inc
      )(result)

      // 属性を初期化します。
      result = set(
        lensPath(['actionPlayerIndex']),
        winnerIndex
      )(result)

      // トリック終了処理を呼び出します。
      result = endTrick(result)

      // リターン。
      return result
    }

    // ボーナス・スコアを取得する関数です。
    const getBonusScore = (state, playerIndex) => {
      // 予測と勝利数が同じでなければボーナス無し。
      if (state.players[playerIndex].predictionOfWinsCount !== state.players[playerIndex].winsCount) {
        return 0
      }

      // パラドックしたらボーナス無し。
      if (playerIndex === actionPlayerIndex && action === 'paradox') {
        return 0
      }

      // プレイヤー・トークンを置いた場所を取得します。
      const board = map(
        color => map(ownerIndex => ownerIndex === playerIndex, state.board[color]),
        COLORS
      )

      // 上下左右で接続しているプレイヤー・トークンの数を数える関数です。
      const getConnectedCount = (y, x) => {
        // 深さ優先探索で、接続しているプレイヤー・トークンの数を数えます。

        let result = 0

        const stack = [[y, x]]
        board[y][x] = false

        while (stack.length > 0) {
          const [y, x] = stack.pop()

          result = result + 1

          for (const [y_, x_] of filter(([y, x]) => y >= 0 && y < 4 && x >= 0 && x < 8, [[y, x + 1], [y, x - 1], [y + 1, x], [y - 1, x]])) {
            if (!board[y_][x_]) {
              continue
            }

            stack.push([y_, x_])
            board[y_][x_] = false
          }
        }

        return result
      }

      // 戻り値。
      let result = 0

      // ボーナス・スコアを取得します。
      for (const i of range(0, 4)) {
        for (const j of range(0, 8)) {
          if (!board[i][j]) {
            continue
          }

          result = max(
            result,
            getConnectedCount(i, j)
          )
        }
      }

      // リターン。
      return result
    }

    // ラウンドを終了する関数です。
    const endRound = state => {
      // 戻り値。
      let result = state

      // 勝利数をスコアに反映させます。
      for (const i of range(0, 4)) {
        result = over(
          lensPath(['players', i, 'score']),
          score => score + (i === actionPlayerIndex && action === 'paradox' ? -1 : 1) * result.players[i].winsCount
        )(result)
      }

      // ボーナスをスコアに反映させます。
      for (const i of range(0, 4)) {
        result = over(
          lensPath(['players', i, 'score']),
          score => score + getBonusScore(result, i)
        )(result)
      }

      // 手札を作成します。
      const handsCollection = map(
        sort(ascend(identity)),
        splitEvery(
          10,
          shuffle(
            this.rng,
            chain(
              repeat(__, 5),
              range(0, 8)
            )
          )
        )
      )

      // プレイヤーの属性を初期化します。
      for (const i of range(0, 4)) {
        result = pipe(
          set(
            lensPath(['players', i, 'hands']),
            handsCollection[i]
          ),
          set(
            lensPath(['players', i, 'phase']),
            0
          ),
          set(
            lensPath(['players', i, 'colors']),
            zipObj(
              COLORS,
              repeat(true, 4)
            )
          ),
          set(
            lensPath(['players', i, 'predictionOfWinsCount']),
            null
          ),
          set(
            lensPath(['players', i, 'winsCount']),
            0
          )
        )(result)
      }

      // 属性を初期化します。
      result = pipe(
        set(
          lensPath(['board']),
          zipObj(
            COLORS,
            repeat(
              repeat(null, 8),
              4
            )
          )
        ),
        over(
          lensPath(['round']),
          inc
        ),
        state => set(
          lensPath(['actionPlayerIndex']),
          state.round
        )(state)
      )(result)

      // リターン。
      return result
    }

    // パラドックスが発生したら……
    if (action === 'paradox') {
      // トリックとラウンドを終了させます。
      return pipe(
        endTrick,
        endRound
      )(state)
    }

    // 戻り値。
    let result = state

    // アクションを実行します。
    result = doAction(result)

    // まだアクションを実行していないプレイヤーがいる場合は……
    if (any(isNil, map(i => result.players[i].action, range(0, 4)))) {
      // ターンを終了させます。
      result = endTurn(result)
    } else {
      // トリックを終了させます。
      result = endTrickWithoutParadox(result)

      // プレイヤーの残りカードが1枚になったら……
      if (all(equals(1), map(i => result.players[i].hands.length, range(0, 4)))) {
        // ラウンドを終了させます。
        result = endRound(result)
      }
    }

    // リターン。
    return result
  }

  // ゲームが終了していれば真、そうでなければ偽を返します。
  isEnd (state) {
    return state.round === 4
  }

  // 順位を取得します。
  getOrders (state) {
    return map(i => count(playerState => playerState.score > state.players[i].score, state.players) + 1, range(0, 4)) // 同点は同じ順位とします。
  }
}
