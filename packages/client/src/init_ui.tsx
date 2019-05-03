import * as React from 'react'
import { render } from 'react-dom'
import InfoPanel from './ui/components/InfoPanel/InfoPanel'
import Chat from './ui/components/Chat/Chat'

const GameUI = ({ showChat }) => {
  return (
    <div>
      <InfoPanel />
      <Chat show={showChat} />
    </div>
  )
}

const initUI = ({ showChat = false } = {}) => {
  let node = document.getElementById('game-ui')
  if (!node) {
    node = document.createElement('div')
    node.setAttribute('id', 'game-ui')
    document.body.appendChild(node)
  }
  render(<GameUI showChat={showChat} />, node)
}

export default initUI
