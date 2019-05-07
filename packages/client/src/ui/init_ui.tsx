import * as React from 'react'
import { render } from 'react-dom'
import InfoPanel from './components/InfoPanel/InfoPanel'
import Chat from './components/Chat/Chat'

const GameUI = ({ showChat, showJoin, onJoin }) => {
  return (
    <div>
      <InfoPanel />
      <Chat show={showChat} />
      {showJoin && (
        <button
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            zIndex: 99,
            transform: 'translate(-50%, -50%)',
          }}
          onClick={() => onJoin()}
        >
          Join Game
        </button>
      )}
    </div>
  )
}

const initUI = ({ showChat = false, onJoin, showJoin }) => {
  let node = document.getElementById('game-ui')
  if (!node) {
    node = document.createElement('div')
    node.setAttribute('id', 'game-ui')
    document.body.appendChild(node)
  }
  render(
    <GameUI showChat={showChat} onJoin={onJoin} showJoin={showJoin} />,
    node
  )
}

export default initUI
