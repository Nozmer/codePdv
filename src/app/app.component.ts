import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  constructor(private apiService: ApiService, private authService: AuthService) { };
  title = 'codePdv2';

  // change login to panel
  isLoggedIn: boolean = true;

  onUserLoggedIn(loggedIn: any) {
    this.isLoggedIn = loggedIn.isLoggedIn;
    const userId = this.authService.getUserId();

    // const userId = 1;
    console.log(userId);
  }

  // change menus
  selectMenu: number = 3;
  selectBox(boxIndex: number): void {
    this.selectMenu = boxIndex;
  };
}
