import { spawnSync } from 'child_process'
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'fs'
import { append, compose, head, identity, join, map, nth, range, slice, split, zip } from 'ramda'
import { MersenneTwister19937, integer } from 'random-js'

const rng = process.argv[6] ? MersenneTwister19937.seed(parseInt(process.argv[6])) : MersenneTwister19937.autoSeed()

let commands = process.argv.slice(2, 6)
let orders = [0, 0, 0, 0]

for (const i of range(0, 100)) {
  // データ・ディレクトリ。
  const dataDirectory = `./results/${slice(-2, Infinity, '00' + i)}`

  // ログのディレクトリを作成します。
  if (existsSync(dataDirectory)) {
    rmSync(dataDirectory, { recursive: true })
  }
  mkdirSync(dataDirectory)

  // ゲームを実行します。
  const gameProcess = spawnSync('npm', ['run', 'play', ...(process.platform === 'win32' ? map(command => `"${command}"`) : identity)(commands), `${integer(0, Number.MAX_SAFE_INTEGER)(rng)}`], { shell: true })

  // スコアを更新します。
  const results = split('\n', gameProcess.stdout.toString())
  if (results.length >= 4) {
    orders = map(
      ([totalOrder, order]) => totalOrder + order,
      zip(
        orders,
        map(
          compose(parseInt, nth(1)),
          map(
            split('\t'),
            slice(0, 4, split('\n', gameProcess.stdout.toString()))
          )
        )
      )
    )
  } else {
    console.log(`${i} is no game...`)
  }

  // ゲームのログを作成します。
  writeFileSync(`${dataDirectory}/game.log`, `${join('\n', commands)}\n${gameProcess.stderr.toString()}${gameProcess.stdout.toString()}`)

  // プレイヤーのログを移動します。
  for (const j of range(0, 4)) {
    renameSync(`results/player-${j}.log`, `${dataDirectory}/player-${j}.log`)
  }

  // シフト（ローテート）します。
  commands = append(head(commands), slice(1, Infinity, commands))
  orders = append(head(orders), slice(1, Infinity, orders))
}

// 結果を出力します。
for (const [order, command] of zip(orders, commands)) {
  console.log(`${order / 100}\t${command}`)
}
