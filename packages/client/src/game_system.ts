import { Player } from './game_objects/player'
import { Tank } from './game_objects/tank'
import { Scene } from './engine/scene'
import { GraphicsContext } from './engine/graphics_context'
import { Renderer } from './engine/renderer'
import { LogicFrame } from './engine/logic_frame'
import _ from 'lodash'
import { SimpleBasicShell } from './game_objects/shell'
const debug = require('debug')('tankgame:game_system')

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
  graphicsContext: GraphicsContext
  renderer: Renderer
  logicFrame: LogicFrame
  isReplaying: boolean
  pendingActions: Action[]
  playedActions: Action[]
  frameIndex: number

  constructor(
    graphicsContext: GraphicsContext,
    scene: Scene,
    player: Player,
    renderer: Renderer,
    logicFrame: LogicFrame
  ) {
    this.graphicsContext = graphicsContext
    this.scene = scene
    this.player = player
    this.players = {}
    this.renderer = renderer
    this.logicFrame = logicFrame
    this.isReplaying = false
    // 用于记录回放过程中接收到的 action，在回放完之后接着回放
    // 直到 pendingActions 为空
    this.pendingActions = []
    this.playedActions = []
  }

  loop() {
    const render = () => {
      requestAnimationFrame(() => {
        this.renderer.render()
        render()
      })
    }
    render()

    setInterval(() => {
      this.logicFrame.tick()
      this.frameIndex++
    }, this.logicFrame.frameTick)
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
      graphics: this.graphicsContext,
    })
    this.scene.addObject(_tank)
    return _tank
  }

  addSelfTank() {
    const x = 100
    const y = 100
    const vx = 0
    const vy = 0
    const tank = createTank({
      x,
      y,
      vx,
      vy,
      graphics: this.graphicsContext,
    })
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

  tankFire(playerId?: string) {
    const tank = this.getTank(playerId)
    // TODO: 添加 weapon 逻辑
    const shell = new SimpleBasicShell(this.graphicsContext)
    shell.from = tank
    shell.position.assign(tank.position)
    shell.velocity.x =
      SimpleBasicShell.maxSpeed * Math.cos(tank.wheelRotation.rotation)
    shell.velocity.y =
      SimpleBasicShell.maxSpeed * Math.sin(tank.wheelRotation.rotation)
    this.scene.addObject(shell)
  }

  updateTankDirection(directionKey, playerId?: string) {
    const tank = this.getTank(playerId)
    switch (directionKey) {
      case 'w':
        tank.goForward()
        break
      case 's':
        tank.goBackward()
        break
      case 'a':
        tank.turnLef()
        break
      case 'd':
        tank.turnRight()
      default:
        break
    }
  }

  stopTank(playerId?: string) {
    const tank = this.getTank(playerId)
    tank.stopMoving()
  }

  updateTankTurn(turn: string, playerId?: string) {
    const tank = this.getTank(playerId)
    switch (turn) {
      case 'left':
        tank.turnLef()
        break

      case 'right':
        tank.turnRight()
        break

      case 'stop':
        tank.stopTurning()
        break

      default:
        throw new Error(`unknown turn: ${turn} found`)
    }
  }

  replay(actions: Action[]) {
    if (!actions.length) {
      throw new Error(`actions is empty`)
    }
    for (let action of actions) {
      if (action.meta.frameIndex === undefined) {
        debug('action with no frameIndex', action)
        throw new Error(`action with no frameIndex found`)
      }
    }
    this.isReplaying = true

    const lastAction = _.last(actions)
    const firstAction = _.last(this.playedActions)
    let playedActionIndex = 0
    const startFrame = firstAction ? firstAction.meta.frameIndex + 1 : 0
    const endFrame = lastAction.meta.frameIndex

    debug('startFrame', startFrame, 'endFrame', endFrame)

    for (
      let currentFrame = startFrame;
      currentFrame <= endFrame;
      currentFrame++
    ) {
      this.logicFrame.tick()

      while (
        actions[playedActionIndex] &&
        actions[playedActionIndex].meta.frameIndex === currentFrame
      ) {
        this.playAction(actions[playedActionIndex])
        playedActionIndex++
      }
      this.renderer.render()
    }

    if (this.pendingActions.length) {
      this.replay(this.pendingActions)
      this.pendingActions = []
    } else {
      this.isReplaying = false
      this.frameIndex = endFrame
      this.loop()
    }
  }

  playAction(action) {
    const {
      type,
      payload,
      meta: { playerId },
    } = action
    debug('playAction', action)
    switch (type) {
      case 'load_history': {
        debug('load_history', payload)
        if (payload.length === 0) {
          this.frameIndex = 0
          this.loop()
        } else {
          this.replay(payload)
        }
        break
      }

      case 'tank_fire':
        this.tankFire(playerId)
        break

      case 'init_player':
        this.initPlayer(payload)
        break

      case 'stop_tank':
        this.stopTank(playerId)
        break

      case 'update_tank_turn':
        this.updateTankTurn(payload, playerId)
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
    this.playedActions.push(action)
  }

  onReceiveAction = (action: Action) => {
    if (this.isReplaying) {
      this.pendingActions.push(action)
      return
    }
    this.playAction(action)
  }
}
