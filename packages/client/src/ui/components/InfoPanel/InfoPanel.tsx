import React, { Component } from 'react'
import './InfoPanel.css'
import { guid } from '../../../utils/utils'
import getSocket from '../../../helpers/getSocket'

class InfoPanel extends Component {
  socket = getSocket()

  state = {
    onlinePlayerCount: 0,
    ping: 'N/A',
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
      emittedAt: new Date().valueOf(),
    }
    this.socket.emit('s_ping', lastPing)
    this.socket.on('s_pong', data => {
      if (data.uuid === lastPing.uuid) {
        const ping = new Date().valueOf() - lastPing.emittedAt
        this.setState({
          ping,
        })
      }
    })
  }

  updatePlayerCount = count => {
    this.setState({
      onlinePlayerCount: count,
    })
  }

  render() {
    const { onlinePlayerCount, ping } = this.state
    return (
      <div className="info-panel">
        <span>{onlinePlayerCount} players</span>
        <span
          style={{
            display: 'inline-block',
            margin: '0 10px',
          }}
        >
          |
        </span>
        <span>ping: {ping}</span>
      </div>
    )
  }
}

export default InfoPanel
