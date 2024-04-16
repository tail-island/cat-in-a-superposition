import { spawnSync } from 'child_process'
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'fs'
import { addIndex, join, map, range, split, zip } from 'ramda'
import { MersenneTwister19937, integer } from 'random-js'
import { Permutation } from 'js-combinatorics'

const rng = process.argv[6] ? MersenneTwister19937.seed(parseInt(process.argv[6])) : MersenneTwister19937.autoSeed()

const commands = process.argv.slice(2, 6)
const scores = [0, 0, 0, 0]

for (const i of range(0, 4)) {
  const indicesCollection = [...new Permutation(range(0, 4))]
  const seed = integer(0, Number.MAX_SAFE_INTEGER)(rng)

  //  すべての並び順でゲームします。
  for (const indices of indicesCollection) {
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
    const gameProcess = spawnSync('npm', ['run', 'play', ...map(index => `"${commands[index]}"`, indices), `${seed}`], { shell: true })

    // npm run playの結果を取得します。
    const results = split('\n', gameProcess.stdout.toString())

    if (results.length >= 4) {
      // スコアを更新します。
      const orders = map(
        line => parseInt(line),
        results
      )

      for (const [order, index] of zip(orders, indices)) {
        scores[index] += order
      }

      console.error(`# ${gameId}`)
      for (const j of range(0, 4)) {
        console.error(orders[indices.indexOf(j)])
      }
    } else {
      console.error(`${gameId} is no game...`)
    }

    // ゲームのログを作成します。
    writeFileSync(
      `${dataDirectory}/game.log`,
      `${join('\n', addIndex(map)((index, i) => `player-${i}\t${commands[index]}`, indices))}\n${gameProcess.stderr.toString()}${gameProcess.stdout.toString()}`
    )

    // プレイヤーのログを移動します。
    for (const [j, index] of zip(range(0, 4), indices)) {
      renameSync(`results/player-${j}.log`, `${dataDirectory}/${index}.log`)
    }
  }
}

// 結果を出力します。
for (const [score, command] of zip(scores, commands)) {
  console.log(`${(score / 96).toFixed(3)}\t${command}`)
}
