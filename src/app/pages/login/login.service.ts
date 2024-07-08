import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../environments/environments.prod';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

constructor(private http : HttpClient) { }
  login(data:any):Promise<any>{
    return this.http.post(`${apiUrl}/login`,data).toPromise()
  }

  register(data:any):Promise<any>{
    return this.http.post(`${apiUrl}/register`,data).toPromise()
  }
}
