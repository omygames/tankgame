// @ts-check
import React, { Component } from 'react'
import PT from 'prop-types'
import TankGameFS from '../../components/TankGameFS/TankGameFS'

class TankGameFSContainer extends Component {
  static propTypes = {
    socket: PT.object.isRequired
  }

  socket = this.props.socket

  componentDidMount() {
    // 获取玩家信息
    this.socket.on('player_init', this.tankGame.engine.initSelf)
    this.socket.on('tank_game_frame:init', this.tankGame.engine.initGame)
    this.socket.on('tank_game_frame:sync', this.tankGame.engine.dispatchEvent)
  }

  handlePushClientEvent = event => {
    this.socket.emit('tank_game_frame:sync', event)
  }

  render() {
    return (
      <TankGameFS
        ref={ ref => { this.tankGame = ref } }
        onPushClientEvent={this.handlePushClientEvent}
      />
    )
  }
}

export default TankGameFSContainer
