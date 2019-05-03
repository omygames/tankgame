import * as React from 'react'
import { render } from 'react-dom'

const initUI = () => {
  if (document.getElementById('game-ui')) {
    return
  }
  const node = document.createElement('div')
  node.setAttribute('id', 'game-ui')
  document.body.appendChild(node)
  render(<div>ok</div>, node)
}

export default initUI
