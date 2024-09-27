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
    TO DO -
      // username should be taken as input - DONE
      // Admin and user logic - only admin can dismiss message from most liked - DONE
      // logic for roomId ?? maybe - DONE
      user joined ui message
      user disconnected ui message
      dislike backend logic
      most liked window heading different for admin and user
      multilingual

    ISSUES FOUND -
      remove chat from most liked section and like any chat removed message will reappear
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
