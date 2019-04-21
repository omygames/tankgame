import React, { Component } from 'react'
import Chat from '../Chat/Chat'
import SnakeGameComponent from '../../components/SnakeGame/SnakeGame'

class SnakeGame extends Component {
  socket = this.props.socket

  componentDidMount() {
    this.socket.on('player_init', this.snakeGame.initPlayer)
    this.socket.on('player_join', data => {
      this.snakeGame.addSnakePlayer(data.id, data)
    })
    this.socket.on('player_leave', data => {
      this.snakeGame.removeSnakePlayer(data.id)
    })
    this.socket.on('snake_game:sync_state', this.snakeGame.syncState)
    this.socket.on('snake_game:update_self', this.snakeGame.updateSelf)
  }

  handleGameInit = () => {
    this.socket.emit('snake_game:init')
  }

  handlePushClientState = state => {
    this.socket.emit('snake_game:client_state_update', state)
  }

  render() {
    return (
      <div className="snake-game">
        <Chat socket={this.socket} />
        <div className="game">
          <SnakeGameComponent
            socket={this.socket}
            ref={ref => { this.snakeGame = ref }}
            onInitGame={this.handleGameInit}
            onPushClientState={this.handlePushClientState}
          />
        </div>
      </div>
    )
  }
}

export default SnakeGame
