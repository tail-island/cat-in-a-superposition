import Timeout from 'await-timeout'
import { spawn } from 'child_process'
import { createWriteStream } from 'fs'
import { count, equals, find, insert, isNotNil, join, lensPath, map, range, set, zipObj } from 'ramda'
import { createInterface } from 'readline'
import { COLORS, Game } from '../models/game.js'

function logState (state) {
  console.error(
    join(
      '\n',
      [
        '~~~',
        `round: ${state.round < 4 ? state.round + 1 : '-'}`,
        `led-color: ${state?.ledColor?.[0] ?? '-'}`,
        '',
        join(
          '\n',
          map(
            color => join(
              ' ',
              insert(
                0,
                `${color[0]}:`,
                map(
                  cell => isNotNil(cell) ? state.players[cell].name[0] : '-',
                  state.board[color]
                )
              )
            ),
            COLORS
          )
        ),
        '',
        join(
          '\n\n',
          map(
            player => {
              return join(
                '\n',
                [
                  `# ${player.name[0]}`,
                  '',
                  `score: ${player.score}`,
                  `prediction: ${player.predictionOfWinsCount ?? '-'}`,
                  `wins: ${player.winsCount}`,
                  `hands: ${join(' ', player.hands)}`,
                  `colors: ${join(' ', map(color => player.colors[color] ? color[0] : '-', COLORS))}`,
                  `action: ${isNotNil(player.action) ? `${player.action.color[0]} ${player.action.hand}` : '-'}`
                ]
              )
            },
            state.players
          )
        ),
        '~~~'
      ]
    )
  )
}

function beginGame (player, parameter) {
  return new Promise(resolve => {
    player.stdout.once('line', line => {
      resolve()
    })

    player.stdin.write(`${JSON.stringify({ command: 'beginGame', parameter })}\n`)
  })
}

function getAction (player, parameter) {
  return new Promise(resolve => {
    player.stdout.once('line', line => {
      resolve(line)
    })

    player.stdin.write(`${JSON.stringify({ command: 'getAction', parameter })}\n`)
  })
}

function observe (player, parameter) {
  return new Promise(resolve => {
    player.stdout.once('line', line => {
      resolve(line)
    })

    player.stdin.write(`${JSON.stringify({ command: 'observe', parameter })}\n`)
  })
}

function endGame (player) {
  return new Promise(resolve => {
    player.stdout.once('line', line => {
      resolve()
    })

    player.stdin.write(`${JSON.stringify({ command: 'endGame' })}\n`)
  })
}

if (process.argv.length < 6) {
  console.error('Error!')
  console.error('usage: npm run xxx "command for player A" "command for player B" "command for player C" "command for player D"')

  process.exit(1)
}

const players = process.argv.slice(2, 6).map((command, i) => {
  const result = spawn(command.split(' ')[0], command.split(' ').slice(1))

  result.stdout = createInterface(result.stdout)

  const stream = createWriteStream(`results/player-${i}.log`)
  createInterface(result.stderr).on('line', line => { stream.write(`${line}\n`) })

  return result
})

const game = new Game(process.argv[6] != null ? parseInt(process.argv[6]) : null)

let state = game.getNewState()
logState(state)

for (const i of range(0, players.length)) {
  await beginGame(players[i], { name: state.players[i].name })
}

try {
  for (;;) {
    const playerIndex = state.actionPlayerIndex
    const legalActions = game.getLegalActions(state)

    const actionString = await Timeout.wrap(
      getAction(
        players[playerIndex],
        {
          board: state.board,
          players: zipObj(
            map(playerState => playerState.name, state.players),
            map(
              i => {
                if (i === playerIndex) {
                  return state.players[i]
                } else {
                  return set(lensPath(['hands']), null)(state.players[i])
                }
              },
              range(0, state.players.length)
            )
          ),
          turn: state.turn,
          ledColor: state.ledColor,
          legalActions
        }
      ),
      15_000,
      'timeout...'
    )

    console.error(`\n${state.players[playerIndex].name}: ${actionString}\n`)

    const action = JSON.parse(actionString)

    if (find(equals(action), legalActions) === undefined) {
      console.error('illegal action...')
      break
    }

    state = game.getNextState(state, action)

    for (const i of range(0, state.players.length)) {
      await Timeout.wrap(
        observe(
          players[i],
          {
            board: state.board,
            players: zipObj(
              map(playerState => playerState.name, state.players),
              map(
                j => {
                  if (j === i) {
                    return state.players[j]
                  } else {
                    return set(lensPath(['hands']), null)(state.players[j])
                  }
                },
                range(0, state.players.length)
              )
            ),
            turn: state.turn,
            ledColor: state.ledColor
          }
        ),
        15_000,
        'timeout...'
      )
    }

    if (game.isEnd(state)) {
      for (const i of range(0, state.players.length)) {
        console.log(`${state.players[i].score}\t${count(playerState => playerState.score > state.players[i].score, state.players) + 1}`)
      }

      break
    }

    logState(state)
  }
} catch (error) {
  console.error(error.message)
} finally {
  for (const player of players) {
    try {
      await Timeout.wrap(endGame(player), 30_000, 'timeout...')
    } catch (error) {
      console.error(error.message)
    }
  }
}
