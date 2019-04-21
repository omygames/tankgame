import React, { Component } from 'react'
import PT from 'prop-types'
import './Chat.css'
import guid from '../../utils/guid'

// const fakeData = _.times(20, n => {
//   return {
//     playerName: 'player1',
//     message: 'this is a message'
//   }
// })

class Chat extends Component {
  static propTypes = {
    socket: PT.object.isRequired
  }

  state = {
    msg: '',
    chatHistory: []
  }
  socket = this.props.socket

  componentDidMount() {
    this.socket.on('new_chat_message', data => {
      this.setState({
        chatHistory: this.state.chatHistory.concat([{
          ...data,
          playerName: `player${data.playerId}`
        }])
      }, () => {
        this.chatHist.scrollTop = this.chatHist.scrollHeight - this.chatHist.clientHeight
      })
    })
  }

  handleKeyDown = e => {
    if (e.key === 'Enter') {
      this.handleSend()
    }
  }

  handleSend = () => {
    const chatData = {
      message: this.state.msg,
      uuid: guid()
    }
    this.socket.emit('send_chat_message', chatData)
    this.setState({
      msg: ''
    })
  }

  handleMsgInput = e => {
    this.setState({
      msg: e.target.value
    })
  }

  render() {
    const { chatHistory, msg } = this.state
    return (
      <div className="chat">
        <div className="chat__history" ref={ ref => { this.chatHist = ref }}>
          {
            chatHistory.map(item => {
              return (
                <div className="chat__history__line" key={item.uuid}>
                  <span className="chat__history__player-name">{item.playerName}</span>
                  <span>{item.message}</span>
                </div>
              )
            })
          }
        </div>
        <div className="chat__footer">
          <input onKeyDown={this.handleKeyDown} onChange={this.handleMsgInput} value={msg} placeholder="输入消息..." />
          <button onClick={this.handleSend}>发送</button>
        </div>
      </div>
    )
  }
}

export default Chat
