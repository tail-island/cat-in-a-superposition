class WebSocketPlayer {
  constructor (webSocket) {
    this.webSocket = webSocket
  }

  async communicate (message) {
    await new Promise(resolve => {
      setTimeout(() => {
        if (this.webSocket.readyState) {
          resolve()
        }
      }, 100)
    })

    return new Promise(resolve => {
      this.webSocket.addEventListener(
        'message',
        event => {
          resolve(JSON.parse(event.data))
        },
        { once: true }
      )

      this.webSocket.send(JSON.stringify(message))
    })
  }

  async beginGame (playerIndex) {
    await this.communicate({
      command: 'beginGame',
      parameter: {
        playerIndex
      }
    })
  }

  async getAction (board, players, turn, ledColor, legalActions) {
    return await this.communicate({
      command: 'getAction',
      parameter: {
        board,
        players,
        turn,
        ledColor,
        legalActions
      }
    })
  }

  async observe (board, players, turn, ledColor, actionPlayerIndex, action) {
    await this.communicate({
      command: 'observe',
      parameter: {
        board,
        players,
        turn,
        ledColor,
        actionPlayerIndex,
        action
      }
    })
  }

  async endGame () {
    await this.communicate({
      command: 'endGame'
    })
  }
}

let webSocket = null

export function createPlayer (port) {
  if (!webSocket) {
    webSocket = new WebSocket(`ws://localhost:${port}`)
  }

  return new WebSocketPlayer(webSocket)
}
