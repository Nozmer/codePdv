import { Component } from '@angular/core';
import { ApiService } from '../../api.service';

// rxjs
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-menu-manage-cash-register',
  templateUrl: './menu-manage-cash-register.component.html',
  styleUrl: './menu-manage-cash-register.component.css'
})

export class MenuManageCashRegisterComponent {
  constructor(private apiService: ApiService) { }

  isBack: boolean = false;

  // init
  ngOnInit(): void {
    this.requestShowCashRegisters();
  }

  productData: any = [];

  // selectBoxCashRegister
  boxSelectCashRegister: number = 0;
  changeBoxSelectCashRegister(numbeSelect: number): void {
    this.boxSelectCashRegister = numbeSelect;
  }

  // changeToPermissionOrDashboard
  selectTab: number = 0;
  changeTabsEdit(numberSelectTab: number): void {
    this.selectTab = numberSelectTab;
  }

  // selects permissions in partEdit_box_infoAboutCashRegister
  permissions: boolean[] = new Array(4).fill(false); // ou ajuste o tamanho conforme necessário

  onPermissionChanged(activated: boolean, index: number): void {
    this.permissions[index] = activated;
  }

  // cashRegister
  showListCashRegister: boolean = true;

  changeAddToList(select: boolean) {
    this.showListCashRegister = select;
  }

  nameCashRegister: string = "";
  passCashRegister: string = "";

  inAnimationOrLoading: boolean = false;
  borderInputName: string = "";
  borderinputPass: string = "";
  addCashRegister() {
    if (!this.inAnimationOrLoading) {
      if (this.nameCashRegister == "") {
        this.changeColorInput(0);
      } else if (this.passCashRegister == "") {
        this.changeColorInput(1);
      } else {
        const userData = {
          user_id: 1,
          name: this.nameCashRegister,
          pass: this.passCashRegister,
        };

        this.requestNewCashRegister(userData);
      }
    }
  }

  changeColorInput(option: number) {
    this.inAnimationOrLoading = true;

    if (option == 0) {
      this.borderInputName = "1px solid #E29090";
    } else {
      this.borderinputPass = "1px solid #E29090";
    }

    setTimeout(() => {
      this.inAnimationOrLoading = false;
      if (option == 0) {
        this.borderInputName = "1px solid rgba(237, 236, 236, 1)";
      } else {
        this.borderinputPass = "1px solid rgba(237, 236, 236, 1)";
      }
    }, 2000);
  }

  showfinishCreateCash: boolean = false;
  showLoadingCreateCash: boolean = false;
  requestNewCashRegister(userData: any) {
    this.inAnimationOrLoading = true;

    this.apiService.addCashRegister(userData)
      .pipe(
        catchError(error => {
          if (error.status == 401) {
            console.log("produto não encontrado");
          }
          return EMPTY;
          // throw error;
        })
      )
      .subscribe(response => {
        this.inAnimationOrLoading = false;
        this.showfinishCreateCash = true;
        setTimeout(() => {
          this.showListCashRegister = true;
          this.nameCashRegister = "";
          this.passCashRegister = "";
          this.showfinishCreateCash = false;
        }, 2000);
      });
  }

  arrayCashRegisters: any = [];
  requestShowCashRegisters() {
    const userData = {
      user_id: 1,
    };
    
    this.apiService.showCashRegisters(userData)
      .pipe(
        catchError(error => {
          if (error.status == 401) {
            console.log("produto não encontrado");
          }
          return EMPTY;
          // throw error;
        })
      )
      .subscribe(response => {
        this.arrayCashRegisters = response.cashRegisters;
      });
  }
}
