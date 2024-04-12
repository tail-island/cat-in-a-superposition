import { spawnSync } from 'child_process'
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'fs'
import { addIndex, append, head, join, map, range, slice, split, zip } from 'ramda'
import { MersenneTwister19937, integer } from 'random-js'
import { Permutation } from 'js-combinatorics'

const rng = process.argv[6] ? MersenneTwister19937.seed(parseInt(process.argv[6])) : MersenneTwister19937.autoSeed()

const commands = process.argv.slice(2, 6)
const scores = [0, 0, 0, 0]

for (const i of range(0, 4)) {
  const indices_collection = [...new Permutation(range(0, 4))]
  const seed = integer(0, Number.MAX_SAFE_INTEGER)(rng)

  for (const [indices, j] of zip(indices_collection, range(0, indices_collection.length))) {
    // ゲームのID。
    const gameId = `${i}-${join('', indices)}`

    // データ・ディレクトリ。
    const dataDirectory = `./results/${gameId}`

    // ログのディレクトリを作成します。
    if (existsSync(dataDirectory)) {
      rmSync(dataDirectory, { recursive: true })
    }
    mkdirSync(dataDirectory)

    // ゲームを実行します。
    const gameProcess = spawnSync('npm', ['run', 'play', ...map((index) => `"${commands[index]}"`, indices), `${seed}`], { shell: true })

    // npm run playの結果を取得します。
    const results = split('\n', gameProcess.stdout.toString())

    if (results.length >= 4) {
      // スコアを更新します。
      const orders = map(
        line => parseInt(split('\t', line)[0]),
        results
      )

      for (const [order, index] of zip(orders, indices)) {
        scores[index] += order
      }

      console.log(`# ${gameId}`)
      console.log()
      for (const k of range(0, 4)) {
        console.log(`${orders[indices.indexOf(k)]}\t${commands[k]}`)
      }
      console.log()
    } else {
      console.log(`${i}-${slice(-2, Infinity, '00' + j)} is no game...`)
    }

    // ゲームのログを作成します。
    writeFileSync(
      `${dataDirectory}/game.log`,
      `${join('\n', addIndex(map)((index, i) => `player-${i}\t${commands[index]}`, indices))}\n${gameProcess.stderr.toString()}${gameProcess.stdout.toString()}`
    )

    // プレイヤーのログを移動します。
    for (const [k, index] of zip(range(0, 4), indices)) {
      renameSync(`results/player-${index}.log`, `${dataDirectory}/${k}.log`)
    }
  }
}

// 結果を出力します。
for (const [score, command] of zip(scores, commands)) {
  console.log(`${(score / 96).toFixed(3)}\t${command}`)
}
