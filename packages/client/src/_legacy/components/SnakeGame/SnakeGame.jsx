// @ts-check
import React, { Component } from 'react'
import _ from 'lodash'
import PT from 'prop-types'
import { Snake, Scene } from './gameObjects'
import Game from '../../game/Game'

class SakeGame extends Game {
  next() {
    const game = _.get(this, 'self.game')
    if (!game) return
    if (game.snake) game.snake.move()
  }
}

class SnakeGameComponent extends Component {
  static propTypes = {
    onInitGame: PT.func.isRequired,
    onPushClientState: PT.func.isRequired
  }

  self = null
  socket = this.props.socket

  componentDidMount() {    
    this.initGame()
    document.addEventListener('keydown', this.handleKeyDown)
  }

  updateSelf = player => {
    // TODO
    this.snake = new Snake(player.game.snake)
    this.game.self.game.snake = this.snake
  }

  syncState = data => {
    if (data.type === 'server_state') {
      this.game.updateContext(data.state)
    } else {
      this.game.updatePlayer(data.id, data)
    }
  }

  initPlayer = player => {
    this.self = this.addSnakePlayer(player.id, player)
    this.game.self = player.id
    this.snake = this.self.game.snake
  }

  initGame = () => {
    this.game = new SakeGame()
    /** @type {any} */
    const gameCanvas = document.getElementById('game')
    const ctx = gameCanvas.getContext('2d')
    const scene = new Scene({
      width: 40,
      height: 40,
      scale: 10,
      ctx
    })
    this.scene = scene
    this.props.onInitGame()

    let i = 0
    const animate = () => {
      requestAnimationFrame(animate)
      i++
      if (i !== 1 && i % 5 !== 0) {
        return
      }
      this.game.next()
      if (this.game.self) {
        this.props.onPushClientState(this.game.self)
      }
      const objects = this.game.objects
      scene.render(objects)
    }
    animate()
  }

  addSnakePlayer = (id, player) => {
    // TODO
    this.game.addPlayer(id, player)
    const snake = new Snake({
      scene: this.scene
    })
    return this.game.addPlayer(id, {
      ...player,
      game: {
        snake,
      }
    })
  }

  removeSnakePlayer = id => {
    this.game.removePlayer(id)
  }

  handleKeyDown = evt => {
    switch (evt.keyCode) {
      case 37:
        this.snake.turn('left')
        break
      case 38:
        this.snake.turn('up')
        break
      case 39:
        this.snake.turn('right')
        break
      case 40:
        this.snake.turn('down')
        break
      default:
        break
    }
  }

  render() {
    return (
      <div>
        <canvas onKeyDown={this.handleKeyDown} id="game" width="400" height="400"></canvas>
      </div>
    )
  }
}

export default SnakeGameComponent
