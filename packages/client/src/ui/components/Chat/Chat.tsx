import React, { Component } from 'react'
import './Chat.css'
import getSocket from '../../../helpers/get_socket'
import { guid } from '../../../utils/utils'

// const fakeData = _.times(20, n => {
//   return {
//     playerName: 'player1',
//     message: 'this is a message'
//   }
// })

class Chat extends Component<{
  show: boolean
}> {
  state = {
    msg: '',
    chatHistory: [],
  }
  socket = getSocket()
  chatHist: HTMLElement
  input: HTMLInputElement

  componentDidMount() {
    this.socket.on('new_chat_message', data => {
      this.setState(
        {
          chatHistory: this.state.chatHistory.concat([
            {
              ...data,
              playerName: `player${data.playerId}`,
            },
          ]),
        },
        () => {
          this.chatHist.scrollTop =
            this.chatHist.scrollHeight - this.chatHist.clientHeight
        }
      )
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show === false && this.props.show) {
      this.input.focus()
    }
  }

  handleKeyDown = e => {
    if (e.key === 'Enter' && this.state.msg.trim() !== '') {
      this.handleSend()
    }
  }

  handleSend = () => {
    const chatData = {
      message: this.state.msg,
      uuid: guid(),
    }
    this.socket.emit('send_chat_message', chatData)
    this.setState({
      msg: '',
    })
  }

  handleMsgInput = e => {
    this.setState({
      msg: e.target.value,
    })
  }

  render() {
    const { chatHistory, msg } = this.state
    return (
      <div
        className="chat"
        style={{
          visibility: this.props.show ? 'visible' : 'hidden',
        }}
      >
        <div
          className="chat__history"
          ref={ref => {
            this.chatHist = ref
          }}
        >
          {chatHistory.map(item => {
            return (
              <div className="chat__history__line" key={item.uuid}>
                <span className="chat__history__player-name">
                  {item.playerName}
                </span>
                <span>{item.message}</span>
              </div>
            )
          })}
        </div>
        <div className="chat__footer">
          <input
            ref={ref => (this.input = ref)}
            autoFocus
            onKeyDown={this.handleKeyDown}
            onChange={this.handleMsgInput}
            value={msg}
            placeholder="输入消息..."
          />
          <button onClick={this.handleSend}>发送</button>
        </div>
      </div>
    )
  }
}

export default Chat
