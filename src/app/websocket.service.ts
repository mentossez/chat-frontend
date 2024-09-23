import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chat } from './chat.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  userId!: string;
  allChats = new BehaviorSubject<any>(null);
  updateChat = new BehaviorSubject<any>(null);

  constructor() {
    this.userId = Math.floor(Math.random() * 1000).toString();
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

  joinRoom(username: string): void {
    const message = {
      type: 'JOIN_ROOM',
      payload: {
        name: username,
        userId: this.userId,
        roomId: '1'
      }
    };
    this.socket.send(JSON.stringify(message));
  }

  sendMessage(message: any) {
    this.socket.send(JSON.stringify(message));
  }
}
