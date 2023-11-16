import React, { Component } from 'react';
import * as signalR from '@microsoft/signalr';

import './App.css'

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      newMessage: '',
    };
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7203/api/chatHub' , {
        
      transport: signalR.HttpTransportType.WebSockets,
      
        
    }) 
      .build();

    this.connection.on('Receive', (message) => {
      this.setState((prevState) => ({
        messages: [...prevState.messages, message],
      }));
    });
  }

  componentDidMount() {
    if (this.connection.state === 'Disconnected') {
      this.connection.start().catch((error) => console.error(error));
    }
  }

  handleNewMessageChange = (event) => {
    this.setState({ newMessage: event.target.value });
  };

  sendMessage = () => {
    const { newMessage } = this.state;
    if (newMessage.trim() === '') return;

    this.connection
      .invoke('Send', newMessage)
      .catch((error) => console.error(error));

    this.setState({ newMessage: '' });
  };

  render() {
    const { messages, newMessage } = this.state;

    return (
      <div className="chat">
        <div className="message-list">
          {messages.map((message, index) => (
            <div key={index} className="message">
              {message}
            </div>
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            placeholder="Введите сообщение"
            value={newMessage}
            onChange={this.handleNewMessageChange}
          />
          <button onClick={this.sendMessage}>Отправить</button>
        </div>
      </div>
    );
  }
}

export default Chat;