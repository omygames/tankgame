// @ts-check
import _ from 'lodash'
import { Tank } from './gameObjects'
import Game from '../../game/Game'

const defaultTank = {
  color: 'red',
  color2: 'yellow',
}

class TankGameEngine extends Game {
  constructor({ scene, onPushClientEvent }) {
    super()
    this.scene = scene
    this.onPushClientEvent = onPushClientEvent
  }

  next() {
    this.objects.forEach(object => {
      if (object.objects) {
        object.objects.forEach(obj => {
          obj.next()
        })
      } else {
        object.next()
      }
    })
    _.get(this, 'tank.bullets', [])
      .filter(b => !b.inactive)
      .forEach(bullet => {
        _.forEach(this.players, player => {
          const targetTank = player.game.tank
          if (player !== this.self && this.judgeHit(bullet, targetTank)) {
            bullet.inactive = true
            targetTank.injured()
            this.onPushClientEvent({
              type: 'tank_injured',
              meta: {
                uid: player.id
              }
            })
          }
        })
      })
  }

  judgeHit(bullet, tank) {
    switch (tank.direction) {
      case 0:
      case 1:
        if (bullet.x >= tank.x && bullet.x <= tank.x + 20 && bullet.y >= tank.y - 1 && bullet.y <= tank.y + 22) {
          return true
        }
        break
      case 2:
      case 3:
        if (bullet.x >= tank.x - 1 && bullet.x <= tank.x + 22 && bullet.y >= tank.y && bullet.y <= tank.y + 20) {
          return true
        }
        break
      default:
        break
    }
  }

  initGame = gameHistory => {
    gameHistory.forEach(event => {
      if (event && event.type) this.dispatchEvent(event)
    })
  }

  initSelf = player => {
    this.self = this.addPlayer(player.id, player)
    this.self = player.id
  }

  addTankPlayer = (id, player, meta) => {
    const tank = new Tank({
      ...defaultTank,
      x: meta.x,
      y: meta.y
    })
    if (this.self.id === id) {
      this.tank = tank
    }
    return super.addPlayer(id, {
      ...player,
      game: {
        tank,
      }
    })
  }

  dispatchEvent = ({ type, payload, meta }) => {
    switch (type) {
      case 'init_player': {
        this.addTankPlayer(payload.id, payload, meta)
        break
      }
      case 'tank_move': {
        const player = this.findPlayerById(meta.uid)
        player.game.tank.move(payload)
        break
      }
      case 'tank_injured': {
        const player = this.findPlayerById(meta.uid)
        player.game.tank.injured()
        break
      }
      case 'tank_shoot': {
        const player = this.findPlayerById(meta.uid)
        player.game.tank.shoot()
        break
      }
      case 'destroy_player': {
        this.removePlayer(payload)
        break
      }
      default:
        break
    }
  }

  generateSelfEvent = (event) => {
    return {
      ...event,
      meta: {
        uid: this.self.id,
        timestamp: new Date().valueOf()
      }
    }
  }

}

export default TankGameEngine
