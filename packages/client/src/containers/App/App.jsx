// @ts-check
import React, { Component } from 'react'
import './App.css'
import createSocket from '../../helpers/createSocket'
import SnakeGame from '../SnakeGame/SnakeGame'
import TankGameFSContainer from '../TankGameFSContainer/TankGameFSContainer'
import TankGameStateSynced from '../TankGameStateSynced/TankGameStateSynced'
import Pool from '../Pool/Pool'

class App extends Component {
  state = {
    connected: false,
    game: window.location.pathname.substr(1)
  }

  componentDidMount() {
    createSocket().then(socket => {
      this.socket = socket
      this.setState({
        connected: true
      })
    })
  }

  render() {
    const { connected, game } = this.state

    if (!connected) {
      return (
        <div>Connecting...</div>
      )
    }

    const snakeGame = (
      <SnakeGame
        socket={this.socket}
      />
    )
    let gameEle = snakeGame

    if (game === 'tank') {
      gameEle = <TankGameFSContainer socket={this.socket} />
    } else if (game === 'tank2') {
      gameEle = <TankGameStateSynced socket={this.socket} />
    }

    return (
      <div className="App">
        <Pool socket={this.socket} />
        {gameEle}
      </div>
    )
  }
}

export default App
