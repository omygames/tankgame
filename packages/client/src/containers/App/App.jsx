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
    game:
      window.location.pathname.substr(
        1,
        window.location.pathname.length -
          (window.location.pathname.endsWith('/') ? 2 : 1)
      ) || '/',
  }

  componentDidMount() {
    createSocket().then(socket => {
      this.socket = socket
      this.setState({
        connected: true,
      })
    })
  }

  render() {
    const { connected, game } = this.state

    if (!connected) {
      return <div>Connecting...</div>
    }

    const routes = {
      '/': <TankGameFSContainer socket={this.socket} />,
      // @ts-ignore
      tank2: <TankGameStateSynced socket={this.socket} />,
      snake: <SnakeGame socket={this.socket} />,
    }

    const routeEl = routes[game] || routes['/']

    return (
      <div className="App">
        <Pool socket={this.socket} />
        {routeEl}
      </div>
    )
  }
}

export default App
