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

  // permissions if cash register
  permissionsArray: any = [0, 0, 0, 0];

  ngOnInit(): void {
    this.isAuthenticated();
  }

  // change login to panel
  isLoggedIn: boolean = true;

  onUserLoggedIn(loggedIn: any) {
    this.isLoggedIn = loggedIn.isLoggedIn;
    this.isAuthenticated();
  }

  // change menus
  selectMenu: number = 0;
  selectBox(boxIndex: number): void {
    this.selectMenu = boxIndex;
  };

  // isAuthenticated
  isAuthenticated() {
    if (this.authService.isAuthenticated()) {
      const data = this.authService.getInfoUser() ?? { isCashRegister_id: 0, permissions: null };      
      
      if (data.isCashRegister_id > 0) {
        this.selectMenu = 1;
      } else{
        // this.selectMenu = 0;
        this.selectMenu = 3;
      }

      this.permissionsArray = data.permissions?.split(',');
    } else {
      this.isLoggedIn = false;
    }
  }

  // loggedOut
  loggedOut() {
    this.authService.clearToken();
    this.isAuthenticated();
  }
}
