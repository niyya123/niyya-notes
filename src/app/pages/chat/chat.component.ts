import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../../shared/socket.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, Socket } from 'ngx-socket-io'
import { UserInfoService } from '../../shared/userInfo';
import { ChatService } from './chat.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzToolTipModule,
    NzPopoverModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('messages_container') private messages_container: ElementRef | undefined;
  shouldScrollToBottom = true; // Flag to control initial scroll

  message: string = '';
  messages = [];
  loading = true
  total : any

  constructor(private socketService: SocketService,
    private socket : Socket,
    private nzNoti : NzNotificationService,
    private ussv : UserInfoService,
    private csv : ChatService) {}
  ngAfterViewChecked(){
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.loadMessages();
    this.socket.connect();
  
    // Example: Listen for server message
    this.socket.on('New chat message receive', (data: any) => {
      console.log('Received from server:', data);
      let temp = this.ussv.getUser()
      if(data.author == temp.username){}else{
        this.nzNoti.info('New message from '+data.author+'',''+data.text+'')
      }

      this.messages.push(data);
      this.total = data.index 
      this.shouldScrollToBottom = true;
    });
  }

  ngOnDestroy(){
    this.socket.disconnect();
  }

  async loadMessages(){
    let data = {
      page:1,
      pageSize:100
    }
    let req = await this.csv.getMessages(data)
    if(req.code == 200){
      this.messages = req.messages
      this.loading = false
      this.total = req.totalItems
    }
  }

  async sendMessage() {
    if (this.message.trim() !== '') {
      let user = this.ussv.getUser()
      let data = {
        author: user?.username,
        text: this.message.trim(),
        createdAt : this.convertDateToNumber(new Date()),
      }

      let req = await this.csv.sendMessage(data)
      if(req.code == 200){
        this.socket.emit('New chat message receive',req.messageInfo)
        this.message = ''
      }
    }
  }

  convertDateToNumber(date:Date){
    const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return Number(`${year}${month}${day}${hours}${minutes}${seconds}`);
  }

  convertNumberToDate(value:any){
    const str = value.toString();

  const year = parseInt(str.substring(0, 4), 10);
  const month = parseInt(str.substring(4, 6), 10) - 1; // Months are 0-based in JS
  const day = parseInt(str.substring(6, 8), 10);
  const hours = parseInt(str.substring(8, 10), 10);
  const minutes = parseInt(str.substring(10, 12), 10);
  const seconds = parseInt(str.substring(12, 14), 10);

  return new Date(year, month, day, hours, minutes, seconds).toLocaleString('en-GB', { 
    hour: '2-digit', minute: '2-digit', second: '2-digit', 
    day: '2-digit', month: '2-digit', year: 'numeric' 
  }).replace(',', ' at');;
  }

  isMyMessage(msg:any){
    let user = this.ussv.getUser()
    if(msg?.author == user.username){
      return true
    }else{
      return false
    }
  }

  scrollToBottom(){
    let latest = this.total
    try {
      const element = document.getElementById(latest);
      if (element && this.shouldScrollToBottom == true) {
        element.scrollIntoView({ behavior: 'instant', block: 'end', inline: 'nearest' });
        this.shouldScrollToBottom = false; // Disable subsequent scrolls
      }
    } catch (error) {
      console.error('Error scrolling to bottom:', error);
    }

  }
}
