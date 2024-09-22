import { Component } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { Chat } from './chat.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chat-frontend';
  userId!: string;
  allChats!: Chat[];
  likedChats!: Chat[];
  mostLikedChats!: Chat[];

  /*
    To do -
      username should be taken as input
      removed/disconnected user message
      dislike backend logic
      Admin and user logic - only admin can dismiss message from most liked
      logic for roomId ?? maybe
  */

  constructor(
    private readonly websocketService: WebSocketService
  ) {
    this.allChats = [];
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

  initialiseUser() {
    this.userId = Math.floor(Math.random() * 1000).toString();
    const message = {
      type: "JOIN_ROOM",
      payload: {
        name: "Ashish",
        userId: this.userId,
        roomId: "1"
      }
    };
    this.websocketService.sendMessage(message);
  }
}
