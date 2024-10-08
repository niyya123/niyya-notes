
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { apiUrl } from '../environments/environments.prod';



@Injectable({
  providedIn: 'root',
})

export class UserInfoService {
  private user: any = null;
  private token: string = '';
  private id: string = '';

  constructor(private router: Router,
    private http: HttpClient) { }

  setUser(user:any): void {
    let data = {
      "email": user.email,
      "username" : user.username
    }
    localStorage.setItem('user', JSON.stringify(data));
  }

  getUser(): any {
    let test = localStorage.getItem('user')
    return test ? JSON.parse(test) : null;
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
  getToken(){
    return localStorage.getItem('token')
  }

  setUserId(id: string): void {
    localStorage.setItem('userId', id);
  }

  getUserId() {
    return localStorage.getItem('userId')
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  apiGetUserInfo(): Promise<any> {
    let currentToken = this.getToken()
    const headers = new HttpHeaders({
      'Authorization': `${currentToken}`
    });
    return this.http.get<any>(`${apiUrl}/user`, { headers }).toPromise()
  }
}