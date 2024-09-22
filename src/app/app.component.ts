import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chat-frontend';
  socket = new WebSocket("ws://localhost:8080", ['echo-protocol']);
}
