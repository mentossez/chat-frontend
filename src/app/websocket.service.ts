import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
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
    this.socket = new WebSocket('ws://localhost:8080', ['echo-protocol']);

    this.socket.onopen = () => {
      this.joinRoom();
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

  joinRoom(): void {
    const message = {
      type: 'JOIN_ROOM',
      payload: {
        name: 'Ashish',
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
