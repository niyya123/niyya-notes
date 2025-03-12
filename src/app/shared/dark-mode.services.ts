import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private darkModeKey = 'darkModeEnabled';

  constructor() {
    this.loadTheme(); // Load theme when service is initialized
  }

  toggleDarkMode(): void {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem(this.darkModeKey, JSON.stringify(isDarkMode));
  }

  loadTheme(): void {
    const isDarkMode = JSON.parse(localStorage.getItem(this.darkModeKey) || 'false');
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }
}
