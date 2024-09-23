import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WebSocketService } from '../websocket.service';
import { Chat } from '../chat.model';

@Component({
   selector: 'app-chat-window',
   templateUrl: './chat-window.component.html',
   styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent implements OnInit {
   @Input() windowHeader!: string;
   @Input() hideSendChat: boolean = false;
   @Input() chats!: Chat[];
   @Input() isMostLikedWindow!: boolean;
   isAdmin!: boolean;
   chatMsg!: string;

   constructor(private readonly websocketService: WebSocketService) {}

   ngOnInit(): void {
      this.isAdmin = true;
   }

   sendChat(): void {
      if (this.chatMsg) {
         const message = {
            type: "SEND_MESSAGE",
            payload: {
              message: this.chatMsg,
              userId: this.websocketService.userId,
              roomId: "1"
            }
         };
         this.websocketService.sendMessage(message);
         this.chatMsg = '';
      }
   }
   
   upvote(chat: Chat): void {
      const upvoteMsg = {
         type: "UPVOTE_MESSAGE",
         payload: {
           userId: this.websocketService.userId,
           roomId: '1',
           chatId: chat.id
         }
      }
      this.websocketService.sendMessage(upvoteMsg);
   }
   
   downvote(chat: Chat): void {
      if (chat.upvotes > 0) {
         chat.upvotes--;
      }
   }

   dismissChat(chat: Chat): void {
      this.chats = this.chats.filter(c => c.id !== chat.id);
   }
}
