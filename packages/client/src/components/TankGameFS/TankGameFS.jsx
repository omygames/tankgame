// @ts-check
import React, { Component } from 'react'
import PT from 'prop-types'
import { Scene } from './gameObjects'
import TankGameEngine, { canvas } from './TankGameEngine'

class TankGameFS extends Component {
  static propTypes = {
    onPushClientEvent: PT.func.isRequired
  }

  componentDidMount() {
    const canvas = this.canvas
    const ctx = canvas.getContext('2d')
    const scene = new Scene({
      ctx,
      scale: 1,
      width: canvas.width,
      height: canvas.height
    })
    this.engine = new TankGameEngine({
      scene: this.scene,
      onPushClientEvent: this.props.onPushClientEvent
    })
    this.scene = scene
    document.addEventListener('keydown', this.keydown)

    const animate = () => {
      requestAnimationFrame(animate)
      this.engine.next()
      const objects = this.engine.objects
      scene.render(objects)
    }
    animate()
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydown)
  }

  handleMove = direction => {
    this.engine.tank.move(direction)
    this.props.onPushClientEvent(this.engine.generateSelfEvent({
      type: 'tank_move',
      payload: direction
    }))
  }

  handleShoot = () => {
    this.engine.tank.shoot()
    this.props.onPushClientEvent(this.engine.generateSelfEvent({
      type: 'tank_shoot'
    }))
  }

  keydown = (evt) => {
    switch (evt.key) {
      case 'w':
        this.handleMove('up')
        break
      case 'd':
        this.handleMove('right')
        break
      case 's':
        this.handleMove('down')
        break
      case 'a':
        this.handleMove('left')
        break
      case 'k':
        this.handleShoot()
        break
      // 测试击中效果
      // case 'j':
      //   this.engine.tank.injured()
      //   break
      default:
        break
    }
  }

  render() {
    return (
      <canvas ref={ref => { this.canvas = ref }} width={canvas.width} height={canvas.height}></canvas>
    )
  }
}

export default TankGameFS
