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
  userName!: string;
  allChats!: Chat[];
  likedChats!: Chat[];
  mostLikedChats!: Chat[];
  showPopup = true;

  /*
    To do -
      username should be taken as input - done
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

  join(): void {
    this.websocketService.joinRoom(this.userName);
    this.showPopup = false;
  }
}
