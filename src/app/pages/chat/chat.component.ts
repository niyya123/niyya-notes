import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../../shared/socket.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, Socket } from 'ngx-socket-io'
import { UserInfoService } from '../../shared/userInfo';
import { ChatService } from './chat.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzButtonModule
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
    let month = (date.getMonth() + 1).toString(); // Months are zero-based in JavaScript
    let day = date.getDate().toString();
  
    // Ensure month and day are two digits
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
  
    // Combine into YYYYMMDD format and convert to number
    const formattedDate = `${year}${month}${day}`;
    return parseInt(formattedDate, 10);
  }

  convertNumberToDate(value:any){
    value = value.toString()

    // Extract year, month, and day from the input string
    const year = value.substr(0, 4);
    const month = value.substr(4, 2);
    const day = value.substr(6, 2);

    // Construct the formatted date string in DD/MM/YYYY format
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
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
