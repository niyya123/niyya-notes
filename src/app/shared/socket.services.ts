import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root'
})

export class SocketService {

    constructor(private socket: Socket) {
    }

    sendMessage(message: string) {
        this.socket.emit('New chat message send', message);
    }

    getMessages(){
        return this.socket.fromEvent<string>('message');
    }
}