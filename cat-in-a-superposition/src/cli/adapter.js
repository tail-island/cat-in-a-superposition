import { createInterface } from 'readline'

import(`../players/${process.argv[2]}.js`).then(({ beginGame, getAction, observe, endGame }) => {
  createInterface({ input: process.stdin }).on('line', line => {
    const message = JSON.parse(line)

    switch (message.command) {
      case 'beginGame': {
        const { playerIndex } = message.parameter
        beginGame(playerIndex)
        console.log(JSON.stringify('OK'))
        break
      }

      case 'getAction': {
        const { board, players, turn, ledColor, legalActions } = message.parameter
        console.log(JSON.stringify(getAction(board, players, turn, ledColor, legalActions)))
        break
      }

      case 'observe': {
        const { board, players, turn, ledColor, actionPlayerIndex, action } = message.parameter
        observe(board, players, turn, ledColor, actionPlayerIndex, action)
        console.log(JSON.stringify('OK'))
        break
      }

      case 'endGame': {
        endGame()
        console.log(JSON.stringify('OK'))
        process.exit(0) // プロセス終了。
      }
    }
  })
})
