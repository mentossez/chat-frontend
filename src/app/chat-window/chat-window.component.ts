import { Component, Input } from '@angular/core';
import { WebSocketService } from '../websocket.service';
import { Chat, User } from '../chat.model';

@Component({
   selector: 'app-chat-window',
   templateUrl: './chat-window.component.html',
   styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent {
   @Input() windowHeader!: string;
   @Input() showSendChat: boolean = false;
   @Input() chats!: Chat[];
   @Input() isMostLikedWindow!: boolean;
   @Input() userData!: User;
   chatMsg!: string;

   constructor(private readonly websocketService: WebSocketService) {}

   sendChat(): void {
      if (this.chatMsg) {
         const message = {
            type: "SEND_MESSAGE",
            payload: {
              message: this.chatMsg,
              userId: this.userData.id,
              roomId: this.userData.roomId
            }
         };
         this.websocketService.sendMessageToSocket(message);
         this.chatMsg = '';
      }
   }
   
   updateChat(chat: Chat, isDismissed = false): void {
      const upvoteMsg = {
         type: "UPDATE_MESSAGE",
         payload: {
           userId: this.userData.id,
           roomId: this.userData.roomId,
           chatId: chat.id,
           isDismissed
         }
      }
      this.websocketService.sendMessageToSocket(upvoteMsg);
   }
   
   downvote(chat: Chat): void {
      if (chat.upvotes > 0) {
         chat.upvotes--;
      }
   }
}
