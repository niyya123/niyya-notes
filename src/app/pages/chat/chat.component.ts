import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../../shared/socket.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, Socket } from 'ngx-socket-io'

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {

  message: string = '';
  messages: string[] = [];

  constructor(private socketService: SocketService,
    private socket : Socket) {}

  ngOnInit(): void {
    this.socket.connect();
  
    // Example: Listen for server message
    this.socket.on('New chat message send', (data: any) => {
      console.log('Send to server:', data);
    });
    // Example: Listen for server message
    this.socket.on('New chat message receive', (data: any) => {
      console.log('Received from server:', data);
    });
  }

  ngOnDestroy(){
    this.socket.disconnect();
  }

  sendMessage() {
    if (this.message.trim()) {
      this.socketService.sendMessage(this.message);
      this.message = '';
    }
  }

}
