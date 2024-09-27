import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chat } from './chat.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  allChats = new BehaviorSubject<any>(null);
  updateChat = new BehaviorSubject<any>(null);

  constructor() {
    this.socket = new WebSocket('wss://ws-chat-backend-cs1p.onrender.com', ['echo-protocol']);

    this.socket.onopen = () => {
      console.log("Connected to server");
    };

    this.socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
      const { payload, type } = JSON.parse(event?.data);
      if (type === 'ADD_CHAT') {
        const chat: Chat = {
          id: payload.chatId,
          username: payload.name,
          message: payload.message,
          upvotes: payload.upvotes
        };
        this.allChats.next(chat);
      }
      if (type === 'UPDATE_CHAT') {
        const chat: Partial<Chat> = {
          id: payload.chatId,
          upvotes: payload.upvotes
        };
        this.updateChat.next(chat);
      }
    };
  }

  sendMessageToSocket(message: any) {
    this.socket.send(JSON.stringify(message));
  }
}
