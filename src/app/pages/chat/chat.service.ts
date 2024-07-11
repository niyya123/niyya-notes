import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../environments/environments.prod';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getMessages(params: { page?: number; pageSize?: number }): Promise<any>{
    let reqParams = new HttpParams();
    if(params.page && params.pageSize){
        reqParams = reqParams.append('page', params.page.toString());
        reqParams = reqParams.append('pageSize', params.pageSize.toString());
    }
    return this.http.get<any>(`${apiUrl}/chat/messages`,{ params: reqParams }).toPromise()
}
  sendMessage(data: any): Promise<any> {
    return this.http.post<any>(`${apiUrl}/chat/messages`, data).toPromise()
  }
}
