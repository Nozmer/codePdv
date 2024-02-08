import { Component, NgZone, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private apiService: ApiService, private ngZone: NgZone, private authService: AuthService) { }
  @Output() userLoggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();

  // changeTabLoginRegister
  tabLoginRegister: number = 0;
  changeTabLoginRegister(numberChange: number): void {
    this.tabLoginRegister = numberChange;
  }

  // button send
  showMessagesInLogin: boolean = false;
  showMessagesInRegister: boolean = false;
  showLoading: boolean = false;
  showMessageDefault: boolean = true;
  showMessageOk: boolean = false;
  showMessageBlank: boolean = false;
  showMessageError: boolean = false;

  showMessage(type: string, typeMessage: string): void {
    this.showMessagesInRegister = false;
    this.showMessagesInLogin = false;
    this.showMessageDefault = false;
    this.showMessageBlank = false;
    this.showMessageError = false;

    switch (type) {
      case 'login':
        this.showMessagesInLogin = true;
        break;
      case 'register':
        this.showMessagesInRegister = true;
        break;
      default:
        break;
    }

    switch (typeMessage) {
      case 'blank':
        this.showMessageBlank = true;
        break;
      case 'error':
        this.showLoading = false;
        this.showMessageError = true;
        break;
      case 'ok':
        this.showLoading = false;
        this.showMessageOk = true;
        break;
      case 'waitResponse':
        this.showLoading = true;
        break;
      default:
        break;
    }

    if (typeMessage != "waitResponse") {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.showMessagesInLogin = false;
          this.showMessagesInRegister = false;
          this.showMessageBlank = false;
          this.showMessageOk = false;
          this.showMessageError = false;
          this.showMessageDefault = true;
        });
      }, 2000);
    };

  }

  // createAccount
  nameInput_register: string = "";
  emailInput_register: string = "";
  passwordInput_register: string = "";

  createAccount() {
    // wait message
    if (!this.showMessagesInRegister) {
      // check if is valid
      if (this.nameInput_register != "" && this.emailInput_register != "" &&
        this.passwordInput_register != "") {

        const userData = {
          name: this.nameInput_register,
          email: this.emailInput_register,
          password: this.passwordInput_register
        };

        this.showMessage("register", "waitResponse");
        this.apiService.register(userData)
          .pipe(
            catchError(error => {
              this.showMessage("register", "error");
              console.error('Error registering user:', error);
              throw error;
            })
          )
          .subscribe(response => {
            this.showMessage("register", "ok");
            console.log('Registration successful:', response);
          });
      } else {
        this.showMessage("register", "blank");
      }
    }
  }

  // enterLogin
  emailInput_login: string = "";
  passwordInput_login: string = "";

  enterLogin() {
    if (!this.showMessagesInLogin) {
      if (this.emailInput_login != "" && this.passwordInput_login != "") {
        const userData = {
          email: this.emailInput_login,
          password: this.passwordInput_login
        };

        this.showMessage("login", "waitResponse");
        this.apiService.login(userData)
          .pipe(
            catchError(error => {
              this.showMessage("login", "error");
              console.error('Error registering user:', error);
              throw error;
            })
          )
          .subscribe(response => {
            this.showMessage("login", "waitResponse");

            this.authService.setToken(response.token);
            this.userLoggedIn.emit(true);

            this.showMessage("login", "ok");
          });

      } else {
        this.showMessage("login", "blank");
      }
    }
  }
}
