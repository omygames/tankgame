// @ts-check
import React, { Component } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Scene } from './gameObjects'
import TankGameEngine from './TankGameEngine'
import { getWindowSize } from './helper/screen'

class TankGameFS extends Component {
  static propTypes = {
    onPushClientEvent: PT.func.isRequired,
  }

  downKeys = {}

  componentDidMount() {
    const { ctx, height, width } = this.handleRenderCanvas()
    const scene = new Scene({
      ctx,
      scale: 1,
      width,
      height,
    })
    this.scene = scene
    this.engine = new TankGameEngine({
      scene: this.scene,
      onPushClientEvent: this.props.onPushClientEvent,
    })
    document.addEventListener('keydown', this.keydown)
    document.addEventListener('keyup', this.keyup)
    document.addEventListener('resize', _.throttle(this.handleResize, 500))

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

  handleResize() {
    const { ctx, height, width } = this.handleRenderCanvas()
    this.scene.resize({
      ctx,
      height,
      width,
    })
  }

  handleRenderCanvas() {
    const windowSize = getWindowSize()
    const canvas = this.canvas
    canvas.width = windowSize.width
    canvas.height = windowSize.height
    canvas.style.width = `${windowSize.width}px`
    canvas.style.height = `${windowSize.height}px`

    const ctx = canvas.getContext('2d')
    ctx.scale(windowSize.ratio, windowSize.ratio)
    return {
      ctx,
      height: canvas.height,
      width: canvas.width,
    }
  }

  handleMove = direction => {
    this.engine.tank.move(direction)
    this.props.onPushClientEvent(
      this.engine.generateSelfEvent({
        type: 'tank_move',
        payload: direction,
      })
    )
  }

  handleStop = () => {
    this.engine.tank.stop()
    this.props.onPushClientEvent(
      this.engine.generateSelfEvent({
        type: 'tank_stop',
      })
    )
  }

  handleShoot = () => {
    this.engine.tank.shoot()
    this.props.onPushClientEvent(
      this.engine.generateSelfEvent({
        type: 'tank_shoot',
      })
    )
  }

  keyup = evt => {
    switch (evt.key) {
      case 'w':
      case 'd':
      case 's':
      case 'a':
        delete this.downKeys[evt.key]
        if (_.isEmpty(this.downKeys)) {
          this.handleStop()
        }
        break
      default:
        break
    }
  }

  keydown = evt => {
    // TODO: 使用事件处理器处理状态
    switch (evt.key) {
      case 'w':
        this.handleMove('up')
        this.downKeys.w = true
        break
      case 'd':
        this.handleMove('right')
        this.downKeys.d = true
        break
      case 's':
        this.handleMove('down')
        this.downKeys.s = true
        break
      case 'a':
        this.handleMove('left')
        this.downKeys.a = true
        break
      case 'j':
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
      <canvas
        ref={ref => {
          this.canvas = ref
        }}
        className="fullscreen"
      />
    )
  }
}

export default TankGameFS
