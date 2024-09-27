import { Component } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { Chat, User } from './chat.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  user!: User;
  allChats!: Chat[];
  likedChats!: Chat[];
  mostLikedChats!: Chat[];
  greenBtnName = 'Create room';
  showPopup = true;

  /*
    To do -
      username should be taken as input - done
      removed/disconnected user message
      dislike backend logic
      Admin and user logic - only admin can dismiss message from most liked
      logic for roomId ?? maybe - done
  */

  constructor(
    public websocketService: WebSocketService
  ) {
    this.allChats = [];
    if (!this.user) {
      this.user = new User();
    }
    this.websocketService.allChats.subscribe((chat: Chat) => {
      if (chat) {
        this.allChats.push(chat);
      }
      this.allChats?.map(chat => chat.username = chat.username.toLowerCase());
    });
    this.websocketService.updateChat.subscribe((updatedChat: Chat) => {
      this.allChats?.map(chat => {
        if (chat.id === updatedChat.id) {
          chat.upvotes = updatedChat.upvotes;
        }
      });
      this.likedChats = this.allChats.filter(chat => chat.upvotes >= 3);
      this.mostLikedChats = this.allChats.filter(chat => chat.upvotes >= 5);
    });
  }

  joinRoom(): void {
    this.user.id = Math.floor(Math.random() * 1000).toString();
    if (this.user?.id && this.user?.name && this.user?.roomId) {
      const message = {
        type: 'JOIN_ROOM',
        payload: {
          name: this.user.name,
          userId: this.user.id,
          roomId: this.user.roomId
        }
      };
      this.websocketService.sendMessageToSocket(message);
      this.showPopup = false;
    }
  }

  createRoom(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let roomId = '';
    for (let i = 0; i < 8; i++) {
        roomId += chars.charAt(Math.floor(Math.random() * chars.length));
        if (i === 3) {
            roomId += '-';
        }
    }
    this.user.roomId = roomId.toUpperCase();
    this.user.isAdmin = true;
  }
}
