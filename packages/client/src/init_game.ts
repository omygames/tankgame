import { GraphicsContext } from './engine/graphics_context'
import { Scene } from './engine/scene'
import initUI from './ui/init_ui'
import getSocket from './helpers/get_socket'
import { Player } from './game_objects/player'
import { GameSystem } from './game_system'
import { guid } from './utils/utils'
import { Control } from './control'
import { Renderer } from './engine/renderer'
import { LogicFrame } from './engine/logic_frame'

const createCanvas = () => {
  let canvas = document.getElementById('game-canvas') as HTMLCanvasElement
  if (canvas) {
    return canvas
  }
  canvas = document.createElement('canvas')
  // TODO: 产生了滚动条
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.setAttribute('id', 'game-canvas')
  document.body.appendChild(canvas)
  return canvas
}

const initGame = () => {
  const updateUI = () => {
    initUI(ui)
  }

  const createPlayer = () => {
    // TODO: 用户输入 name
    const id = guid()
    const player = new Player(id)
    socket.emit('client_update', {
      player,
    })
    return player
  }

  const handleJoinGame = () => {
    ui.showJoin = false
    updateUI()
    gameSystem.addSelfTank()
    socket.emit('join_game')
    dispatch({
      type: 'init_player',
      payload: player,
    })
  }

  const ui = {
    showChat: false,
    showJoin: true,
    onJoin: handleJoinGame,
  }
  const socket = getSocket()
  const dispatch = (action: Action) => {
    socket.emit('dispatch_action', {
      ...action,
      meta: {
        frameIndex: gameSystem.frameIndex,
      },
    })
  }
  const player = createPlayer()
  const canvas = createCanvas()
  const graphics = new GraphicsContext(canvas)
  const scene = new Scene(graphics)
  const renderer = new Renderer(graphics, scene)
  const logicFrame = new LogicFrame(scene)
  const gameSystem = new GameSystem(
    graphics,
    scene,
    player,
    renderer,
    logicFrame
  )
  const control = new Control()
  let client

  control
    .on('show_chat_ui', show => {
      ui.showChat = show
      updateUI()
    })
    .on('update_tank_direction', directionKey => {
      gameSystem.updateTankDirection(directionKey)
      dispatch({
        type: 'direction_update',
        payload: directionKey,
      })
    })
    .on('stop_tank', () => {
      gameSystem.stopTank()
      dispatch({
        type: 'stop_tank',
        payload: null,
      })
    })
    .attachKeyboardEvents()

  updateUI()

  socket.on('client_init', c => {
    client = c
  })
  socket.on('receive_action', gameSystem.onReceiveAction)
}

export default initGame
