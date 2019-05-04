import { Graphics } from './engine/graphics'
import { Scene } from './engine/scene'
import initUI from './ui/init_ui'
import getSocket from './helpers/get_socket'
import { Player } from './game_objects/player'
import { GameSystem } from './game_system'
import { guid } from './utils/utils'
import { Control } from './control'

const createCanvas = () => {
  let canvas = document.getElementById('game-canvas') as HTMLCanvasElement
  if (canvas) {
    return canvas
  }
  canvas = document.createElement('canvas')
  // TODO: 产生了滚动条
  canvas.style.width = window.innerWidth + 'px'
  canvas.style.height = window.innerHeight + 'px'
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
    socket.emit('dispatch_action', action)
  }
  const player = createPlayer()
  const canvas = createCanvas()
  const graphics = new Graphics(canvas)
  const scene = new Scene(graphics)
  const gameSystem = new GameSystem(graphics, scene, player)
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

  gameSystem.loop()
  updateUI()

  socket.on('client_init', c => {
    client = c
  })
  socket.on('receive_action', gameSystem.onReceiveAction)
}

export default initGame
