const DIRECTION_KEYS = ['w', 's', 'a', 'd']

export class Control {
  onShowChatUI: (show: boolean) => void
  onUpdateTankDirection: (direction: string) => void
  onTankStop: () => void
  directionKeysDown: string[]

  constructor() {
    this.directionKeysDown = []
  }

  on(event: 'show_chat_ui' | 'update_tank_direction' | 'stop_tank', callback) {
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
      if (DIRECTION_KEYS.includes(e.key)) {
        this.directionKeysDown.push(e.key)
        this.onUpdateTankDirection(e.key)
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
    })
    return this
  }
}
