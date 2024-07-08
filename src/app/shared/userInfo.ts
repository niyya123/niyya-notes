import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })

  export class UserInfoService {
    private user: any = null;
    private token: string = '';
  
    constructor() {}
  
    setUser(user: any): void {
      this.user = user;
    }
  
    getUser(): any {
      return this.user;
    }
  
    clearUser(): void {
      this.user = null;
    }
  
    isAuthenticated(): boolean {
      return this.user !== null;
    }

    setToken(token: string): void {
        this.token = token;
    }

    getToken(): string {
        return this.token;
    }
  }