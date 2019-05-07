import _ from 'lodash'

const DIRECTION_KEYS = ['w', 's']
const TURN_KEYS = ['a', 'd']

const turnMap = {
  a: 'left',
  d: 'right',
}

export class Control {
  onShowChatUI: (show: boolean) => void
  onUpdateTankDirection: (direction: string) => void
  onTankStop: () => void
  onUpdateTankTurn: (turn: string) => void
  onTankFire: () => void
  directionKeysDown: string[]
  turnKeysDown: string[]

  constructor() {
    this.directionKeysDown = []
    this.turnKeysDown = []
  }

  on(
    event:
      | 'show_chat_ui'
      | 'tank_fire'
      | 'update_tank_direction'
      | 'stop_tank'
      | 'update_tank_turn',
    callback
  ) {
    switch (event) {
      case 'show_chat_ui':
        this.onShowChatUI = callback
        break

      case 'update_tank_direction':
        this.onUpdateTankDirection = callback
        break

      case 'stop_tank':
        this.onTankStop = callback
        break

      case 'update_tank_turn':
        this.onUpdateTankTurn = callback
        break

      case 'tank_fire':
        this.onTankFire = callback
        break

      default:
        throw new Error(`Unknown event ${event}`)
    }
    return this
  }

  attachKeyboardEvents() {
    window.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        this.onShowChatUI(true)
      }
      if (e.key === 'Escape') {
        this.onShowChatUI(false)
      }
      if (e.key === 'j') {
        this.onTankFire()
      }
      if (DIRECTION_KEYS.includes(e.key)) {
        if (_.last(this.directionKeysDown) === e.key) {
          return
        }
        this.directionKeysDown.push(e.key)
        this.onUpdateTankDirection(e.key)
      }
      if (TURN_KEYS.includes(e.key)) {
        this.turnKeysDown.push(e.key)
        this.onUpdateTankTurn(turnMap[e.key])
      }
    })

    window.addEventListener('keyup', e => {
      if (DIRECTION_KEYS.includes(e.key)) {
        const lastDirection = this.directionKeysDown[
          this.directionKeysDown.length - 1
        ]
        this.directionKeysDown = this.directionKeysDown.filter(k => k !== e.key)
        if (this.directionKeysDown.length === 0) {
          this.onTankStop()
        } else {
          const newDirection = this.directionKeysDown[
            this.directionKeysDown.length - 1
          ]
          if (newDirection !== lastDirection) {
            this.onUpdateTankDirection(newDirection)
          }
        }
      }
      // TODO: 能否简化代码
      if (TURN_KEYS.includes(e.key)) {
        const lastDirection = this.turnKeysDown[this.turnKeysDown.length - 1]
        this.turnKeysDown = this.turnKeysDown.filter(k => k !== e.key)
        if (this.turnKeysDown.length === 0) {
          this.onUpdateTankTurn('stop')
        } else {
          const newDirection = this.turnKeysDown[this.turnKeysDown.length - 1]
          if (newDirection !== lastDirection) {
            this.onUpdateTankTurn(turnMap[newDirection])
          }
        }
      }
    })
    return this
  }
}
