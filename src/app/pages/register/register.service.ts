import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../environments/environments.prod';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

constructor(private http : HttpClient) { }
register(data:any):Promise<any>{
  return this.http.post(`${apiUrl}/register`,data).toPromise()
}
}
