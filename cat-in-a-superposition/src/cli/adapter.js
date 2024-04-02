import { createInterface } from 'readline'

import(`../players/${process.argv[2]}.js`).then(({ createPlayer }) => {
  const player = createPlayer(process.argv.slice(3))

  createInterface({ input: process.stdin }).on('line', async line => {
    const message = JSON.parse(line)

    switch (message.command) {
      case 'beginGame': {
        const { playerIndex } = message.parameter
        await player.beginGame(playerIndex)
        console.log(JSON.stringify('OK'))
        break
      }

      case 'getAction': {
        const { board, players, turn, ledColor, legalActions } = message.parameter
        console.log(JSON.stringify(await player.getAction(board, players, turn, ledColor, legalActions)))
        break
      }

      case 'observe': {
        const { board, players, turn, ledColor, actionPlayerIndex, action } = message.parameter
        await player.observe(board, players, turn, ledColor, actionPlayerIndex, action)
        console.log(JSON.stringify('OK'))
        break
      }

      case 'endGame': {
        await player.endGame()
        console.log(JSON.stringify('OK'))
      }
    }
  })
})
