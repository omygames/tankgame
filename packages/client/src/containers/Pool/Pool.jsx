import React, { Component } from 'react'
import PT from 'prop-types'
import './Pool.css'
import guid from '../../utils/guid'

class Pool extends Component {
  static propTypes = {
    socket: PT.object.isRequired
  }

  socket = this.props.socket

  state = {
    onlinePlayerCount: 0,
    ping: 'N/A'
  }

  componentDidMount() {
    this.socket.on('player_count_change', data => {
      this.updatePlayerCount(data.count)
    })
    setInterval(this.updatePing, 1000)
  }

  updatePing = () => {
    const lastPing = {
      uuid: guid(),
      emittedAt: new Date().valueOf()
    }
    this.socket.emit('s_ping', lastPing)
    this.socket.on('s_pong', data => {
      if (data.uuid === lastPing.uuid) {
        const ping = data.receivedAt - lastPing.emittedAt
        this.setState({
          ping
        })
      }
    })
  }

  updatePlayerCount = count => {
    this.setState({
      onlinePlayerCount: count
    })
  }

  render() {
    const { onlinePlayerCount, ping } = this.state
    return (
      <div className="info-bar">
        <span>{onlinePlayerCount} 个玩家在线</span>
        <span className="sep">|</span>
        <span>ping: {ping}</span>
      </div>
    )
  }
}

export default Pool
