import { Graphics } from './engine/graphics'
import { Scene } from './engine/scene'
import { Tank } from './game_objects/tank'
import initUI from './ui/init_ui'

const DIRECTION_KEYS = ['w', 's', 'a', 'd']

const initGame = () => {
  if (document.getElementById('game-canvas')) {
    return
  }
  const canvas = document.createElement('canvas')
  // TODO: 产生了滚动条
  canvas.style.width = window.innerWidth + 'px'
  canvas.style.height = window.innerHeight + 'px'
  canvas.setAttribute('id', 'game-canvas')
  document.body.appendChild(canvas)

  const graphics = new Graphics(canvas)
  const scene = new Scene(graphics)
  const tank = new Tank(graphics)
  tank.position.x = 20
  tank.position.y = 20
  tank.velocity.x = 0
  tank.velocity.y = 0
  scene.addObject(tank)
  scene.update()

  let directionKeysDown = []
  let showChat = false

  const updateTankV = (x, y) => {
    tank.velocity.x = x
    tank.velocity.y = y
  }

  const handleDirectionUpdate = directionKey => {
    switch (directionKey) {
      case 'w':
        updateTankV(0, -1)
        break
      case 's':
        updateTankV(0, 1)
        break
      case 'a':
        updateTankV(-1, 0)
        break
      case 'd':
        updateTankV(1, 0)
      default:
        break
    }
  }

  const updateUI = () => {
    initUI({ showChat })
  }

  // the game loop
  const updateFrame = () => {
    requestAnimationFrame(() => {
      scene.update()
      updateFrame()
    })
  }
  updateFrame()

  // setup listeners
  window.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      showChat = true
      updateUI()
    }
    if (e.key === 'Escape') {
      showChat = false
      updateUI()
    }
    if (DIRECTION_KEYS.includes(e.key)) {
      directionKeysDown.push(e.key)
      handleDirectionUpdate(e.key)
    }
  })

  window.addEventListener('keyup', e => {
    if (DIRECTION_KEYS.includes(e.key)) {
      const lastDirection = directionKeysDown[directionKeysDown.length - 1]
      directionKeysDown = directionKeysDown.filter(k => k !== e.key)
      if (directionKeysDown.length === 0) {
        updateTankV(0, 0)
      } else {
        const newDirection = directionKeysDown[directionKeysDown.length - 1]
        if (newDirection !== lastDirection) {
          handleDirectionUpdate(newDirection)
        }
      }
    }
  })

  // render game ui
  updateUI()
}

export default initGame
