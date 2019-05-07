import React, { Component } from 'react'
import UUID from '../../utils/guid'

const canvas = {
  width: 300,
  height: 300
}
const self = {
  uuid: UUID(),
  color: 'red',
  color2: 'yellow',
  x: parseInt(Math.random() * canvas.width, 10),
  y: parseInt(Math.random() * canvas.height, 10),
}

const enemy = {
    color: 'yellow',
}
const playerSpeed = 5
const bulletSpeed = 8

class Player {
  constructor(x, y, color, color2) {
    this.id = UUID()
    this.x = x
    this.y = y
    this.color = color
    this.color2 = color2
    this.direction = parseInt(Math.random() * 4, 10)
    this.bullets = []
    this.alive = true
    this.kill = 0
    this.death = 0
  }
  up() {
    this.y -= playerSpeed
    this.direction = 0
  }
  down() {
    this.y += playerSpeed
    this.direction = 1
  }
  left() {
    this.x -= playerSpeed
    this.direction = 2
  }
  right() {
    this.x += playerSpeed
    this.direction = 3
  }
  shoot() {
    let bullet
    switch (this.direction) {
      case 0:
        bullet = new Bullet(this.x + 9, this.y, this.direction, this)
        break
      case 1:
        bullet = new Bullet(this.x + 9, this.y + 22, this.direction, this)
        break
      case 2:
        bullet = new Bullet(this.x, this.y + 9, this.direction, this)
        break
      case 3:
        bullet = new Bullet(this.x + 22, this.y + 9, this.direction, this)
        break
      default:
        break
    }
    this.bullets = this.bullets.filter(item => {
      return item.alive
    })
    this.bullets.push(bullet)
  }
}

class Bullet {
  constructor(x, y, direction, entity) {
    this.x = x
    this.y = y
    this.direction = direction
    this.alive = true
    this.entity = entity
  }
  run() {
    if (!this.alive) return
    switch (this.direction) { // up0 down1 left2 right3
      case 0:
        this.y -= bulletSpeed
        break
      case 1:
        this.y += bulletSpeed
        break
      case 2:
        this.x -= bulletSpeed
        break
      case 3:
        this.x += bulletSpeed
        break
      default:
        break
    }

    if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) {
      this.alive = false
    }
  }
}

class ShootGame extends Component {
  state = {
    player: {},
    ctx: null,
    bgc: 'black',
    enemys: []
  }
  
  socket = this.props.socket

  initPlayer() {
    this.socket.emit('shoot_game:init', self)
    // return new Player(self.x, self.y, self.color, self.color2)
  }

  renderSecne() {
    this.drawEntity.bind(this)()
    this.drawBulletEntity.bind(this)()
    requestAnimationFrame(this.renderSecne.bind(this))
  }

  // TODO 判断子弹击中
  doAnimateHit() {
    this.player.bullets.forEach(bullet => { // 击中
      this.enemys.forEach(enemy => {
        const hit = this.judgeHit(bullet, enemy)
        if (hit) {
          enemy.alive = false
          bullet.alive = false
          this.player.kill++
        }
      })

      enemy.bullets.forEach(enemyBullet => {

      })
    })
  }

  judgeHit(bullet, entity) {
    switch (entity.direction) {
      case 0:
      case 1:
        if (bullet.x >= entity.x && bullet.x <= entity.x + 20 && bullet.y >= entity.y - 1 && bullet.y <= entity.y + 22) {
          return true
        }
        break
      case 2:
      case 3:
        if (bullet.x >= entity.x - 1 && bullet.x <= entity.x + 22 && bullet.y >= entity.y && bullet.y <= entity.y + 20) {
          return true
        }
        break
      default:
        break
    }
  }

  // TODO 击中效果

  drawBulletEntity() {
    const ctx = this.ctx
    const bullets = this.player.bullets.filter(bullet => {
      return bullet.alive
    })
    this.bullets = bullets
    this.player.bullets.forEach(bullet => {
      if (bullet.alive) {
        ctx.fillStyle = bullet.color || 'red'
        ctx.fillRect(bullet.x, bullet.y, 2, 2)
      }
      bullet.run()
    })
  }

  drawEntity() {
    const entity = this.player
    if (!entity.alive) return
    const ctx = this.ctx
    ctx.fillStyle = this.bgc
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    switch (entity.direction) {
      case 0: // up
      case 1: // down
        ctx.fillStyle = entity.color
        ctx.fillRect(entity.x, entity.y - 1, 5, 22)
        ctx.fillRect(entity.x + 15, entity.y - 1, 5, 22)
        ctx.fillRect(entity.x + 6, entity.y, 8, 20)
        ctx.fillStyle = entity.color
        ctx.beginPath()
        ctx.arc(entity.x + 10, entity.y + 10, 3, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = entity.color2
        ctx.lineWidth = 2
        ctx.moveTo(entity.x + 10, entity.y + 10)
        if (entity.direction === 0) {
          ctx.lineTo(entity.x + 10, entity.y - 10)
        } else if (entity.direction === 1) {
          ctx.lineTo(entity.x + 10, entity.y + 30)
        }
        ctx.stroke()
        break
      case 2: // left
      case 3: // right
        ctx.fillStyle = entity.color
        ctx.fillRect(entity.x - 1, entity.y, 22, 5)
        ctx.fillRect(entity.x - 1, entity.y + 15, 22, 5)
        ctx.fillRect(entity.x, entity.y + 6, 20, 8)
        ctx.fillStyle = entity.color
        ctx.beginPath()
        ctx.arc(entity.x + 10, entity.y + 10, 3, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = entity.color2
        ctx.lineWidth = 2
        ctx.moveTo(entity.x + 10, entity.y + 10)
        if (entity.direction === 2) {
          ctx.lineTo(entity.x - 10, entity.y + 10)
        } else if (entity.direction === 3) {
          ctx.lineTo(entity.x + 30, entity.y + 10)
        }
        ctx.stroke()
        break
      default:
        break
    }
  }

  keydown(evt) {
    const keycode = evt.keyCode
    switch (keycode) {
      case 87: // up w
        this.player.up()
        break
      case 68: // right d
        this.player.right()
        break
      case 83: // down s
        this.player.down()
        break
      case 65: // left a
        this.player.left()
        break
      case 75: // shoot key 'k'
        this.player.shoot()
        break
      default:
        break
    }
  }

  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext('2d')
    this.ctx = ctx

    // canvas.addEventListener('click', this.initPlayer)
    ctx.fillStyle = this.bgc

    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // this.ctx.fillStyle = this.bgc
    this.renderSecne()

    this.initPlayer()
    this.socket.on('shoot_game:sync_state', params => {
      const player = params.state[self.uuid]
      delete params.state[self.uuid]
      const enemy = params.state
      this.player = player
      this.enemy = enemy
      document.addEventListener('keydown', this.keydown.bind(this), false)
      
    })
  }

  render() {
    // const self = this.self
    return (
      <canvas ref="canvas" width={canvas.width} height={canvas.height}></canvas>
    )
  }
}

export default ShootGame