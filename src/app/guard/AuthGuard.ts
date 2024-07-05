import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  temp = true

  canActivate(): boolean {
    if (this.temp) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}