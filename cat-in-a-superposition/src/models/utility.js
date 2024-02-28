import { shuffle as randomShuffle } from 'random-js'

export function shuffle (rng, list) {
  const result = [...list]

  randomShuffle(rng, result)

  return result
}
