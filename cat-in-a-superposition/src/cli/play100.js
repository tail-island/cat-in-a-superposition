import { spawnSync } from 'child_process'
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'fs'
import { append, compose, head, join, last, map, range, slice, split, zip } from 'ramda'
import { MersenneTwister19937, integer } from 'random-js'

const rng = process.argv[6] ? MersenneTwister19937.seed(parseInt(process.argv[6])) : MersenneTwister19937.autoSeed()

let commands = process.argv.slice(2, 6)
let scores = [0, 0, 0, 0]

for (const i of range(0, 100)) {
  // データ・ディレクトリ。
  const dataDirectory = `./results/${slice(-2, Infinity, '00' + i)}`

  // ログのディレクトリを作成します。
  if (existsSync(dataDirectory)) {
    rmSync(dataDirectory, { recursive: true })
  }
  mkdirSync(dataDirectory)

  // ゲームを実行します。
  const child = spawnSync('npm', ['run', 'play', ...commands, `${integer(0, Number.MAX_SAFE_INTEGER)(rng)}`])

  // スコアを更新します。
  const results = split('\n', child.stdout.toString())
  if (results.length >= 4) {
    scores = map(
      ([totalOrder, order]) => totalOrder + order,
      zip(
        scores,
        map(
          compose(parseInt, head),
          map(
            split('\t'),
            slice(0, 4, split('\n', child.stdout.toString()))
          )
        )
      )
    )
  } else {
    console.log(`${i} is no game...`)
  }

  // ゲームのログを作成します。
  writeFileSync(`${dataDirectory}/game.log`, `${join('\n', commands)}\n${child.stderr.toString()}${child.stdout.toString()}`)

  // プレイヤーのログを移動します。
  for (const j of range(0, 4)) {
    renameSync(`results/player-${j}.log`, `${dataDirectory}/player-${j}.log`)
  }

  // シフト（ローテート）します。
  commands = append(head(commands), slice(1, Infinity, commands))
  scores = append(head(scores), slice(1, Infinity, scores))
}

// 結果を出力します。
for (const [order, command] of zip(scores, commands)) {
  console.log(`${order / 100}\t${command}`)
}
