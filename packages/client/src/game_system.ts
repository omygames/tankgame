import { Player } from './game_objects/player'
import { Tank } from './game_objects/tank'
import { Scene } from './engine/scene'
import { Graphics } from './engine/graphics'

const createTank = ({ x, y, vx, vy, graphics }) => {
  const tank = new Tank(graphics)
  tank.position.x = x
  tank.position.y = y
  tank.velocity.x = vx
  tank.velocity.y = vy
  return tank
}

export class GameSystem {
  player: Player
  players: {
    [id: string]: Player
  }
  scene: Scene
  graphics: Graphics

  static updateTankVelocity(tank: Tank, x, y) {
    tank.velocity.x = x
    tank.velocity.y = y
  }

  constructor(graphics: Graphics, scene: Scene, player: Player) {
    this.graphics = graphics
    this.scene = scene
    this.player = player
    this.players = {}
  }

  update() {
    this.scene.update()
  }

  loop() {
    requestAnimationFrame(() => {
      this.update()
      this.loop()
    })
  }

  initPlayer(player) {
    this.players[player.id] = player
    player.tank = this.initTank(player.tank)
  }

  initTank(tank) {
    const _tank = createTank({
      x: tank.position.x,
      y: tank.position.y,
      vx: tank.velocity.x,
      vy: tank.velocity.y,
      graphics: this.graphics,
    })
    this.scene.addObject(_tank)
    return _tank
  }

  addSelfTank() {
    const x = 20
    const y = 20
    const vx = 0
    const vy = 0
    const tank = createTank({ x, y, vx, vy, graphics: this.graphics })
    this.player.tank = tank
    this.scene.addObject(tank)
  }

  removePlayer(id) {
    const tank = this.getTank(id)
    this.scene.removeObject(tank)
    delete this.players[id]
  }

  getTank(playerId?: string) {
    let tank: Tank
    if (!playerId) {
      tank = this.player.tank
    } else if (this.players[playerId]) {
      tank = this.players[playerId].tank
    }
    return tank
  }

  updateTankDirection(directionKey, playerId?: string) {
    const tank = this.getTank(playerId)
    switch (directionKey) {
      case 'w':
        GameSystem.updateTankVelocity(tank, 0, -1)
        break
      case 's':
        GameSystem.updateTankVelocity(tank, 0, 1)
        break
      case 'a':
        GameSystem.updateTankVelocity(tank, -1, 0)
        break
      case 'd':
        GameSystem.updateTankVelocity(tank, 1, 0)
      default:
        break
    }
  }

  stopTank(playerId?: string) {
    const tank = this.getTank(playerId)
    GameSystem.updateTankVelocity(tank, 0, 0)
  }

  onReceiveAction = ({ type, payload, meta: { playerId } }) => {
    switch (type) {
      case 'load_history':
        payload.forEach(this.onReceiveAction)
        break

      case 'init_player':
        this.initPlayer(payload)
        break

      case 'stop_tank':
        this.stopTank(playerId)
        break

      case 'direction_update':
        this.updateTankDirection(payload, playerId)
        break

      case 'destroy_player':
        this.removePlayer(playerId)
        break

      default:
        break
    }
  }
}
