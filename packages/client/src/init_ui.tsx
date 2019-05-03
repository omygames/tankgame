import * as React from 'react'
import { render } from 'react-dom'
import InfoPanel from './ui/components/InfoPanel/InfoPanel'

const GameUI = () => {
  return (
    <div>
      <InfoPanel />
    </div>
  )
}

const initUI = () => {
  if (document.getElementById('game-ui')) {
    return
  }
  const node = document.createElement('div')
  node.setAttribute('id', 'game-ui')
  document.body.appendChild(node)
  render(<GameUI />, node)
}

export default initUI
