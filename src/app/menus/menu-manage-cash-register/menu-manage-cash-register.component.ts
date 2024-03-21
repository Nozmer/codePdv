import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { AuthService } from '../../auth.service';

// rxjs
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-menu-manage-cash-register',
  templateUrl: './menu-manage-cash-register.component.html',
  styleUrl: './menu-manage-cash-register.component.css'
})

export class MenuManageCashRegisterComponent {
  constructor(private apiService: ApiService, private authService: AuthService) { };

  isBack: boolean = false;

  // init
  ngOnInit(): void {
    this.requestShowCashRegisters();
    this.requestAllProduct();
  }

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

  finishSendPermission: boolean = false;
  errorSendPermission: boolean = false;

  sendPermissonsChange() {
    const convertedArray = this.permissions.map(element => element ? 1 : 0);

    if (convertedArray.join(', ') != this.cashRegisterSelect.permissions && !this.finishSendPermission && !this.errorSendPermission) {
      const userData = {
        user_id: this.authService.getInfoUser()?.owner_id,
        cashRegisterSelect: this.cashRegisterSelect.cashRegister_id,
        permissions: convertedArray.join(', ')
      };

      this.apiService.changePermissionsCash(userData)
        .pipe(
          catchError(error => {
            this.errorSendPermission = true;
            setTimeout(() => {
              this.errorSendPermission = false;
            }, 2000);
            return EMPTY;
            // throw error;
          })
        )
        .subscribe(response => {
          this.finishSendPermission = true;
          setTimeout(() => {
            this.finishSendPermission = false;
          }, 2000);
        });
    } else {
      console.log("iguale");
    }
  }

  // cashRegister
  cashRegisterSelect: any;
  showListCashRegister: boolean = true;

  changeAddToList(select: boolean) {
    this.showListCashRegister = select;
  }

  nameCashRegister: string = "";
  passCashRegister: string = "";

  inAnimationOrLoading: boolean = false;
  borderInputName: string = "";
  borderinputPass: string = "";
  showErroPlanCash: boolean = false;
  numberCashAllow: number = 0;

  addCashRegister() {
    if (!this.inAnimationOrLoading) {
      if (this.nameCashRegister == "") {
        this.changeColorInput(0);
      } else if (this.passCashRegister == "") {
        this.changeColorInput(1);
      } else {        
        if (this.arrayCashRegisters.length >= 2 && this.authService.getInfoUser()?.typePlan == 0) {
          this.numberCashAllow = 2;
          this.showErroPlanCash = true;

          setTimeout(() => {
            this.showErroPlanCash = false;
          }, 2000);

        } else {
          const userData = {
            user_id: this.authService.getInfoUser()?.owner_id,
            name: this.nameCashRegister,
            pass: this.passCashRegister,
          };

          this.requestNewCashRegister(userData);
        }
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
  showErroMultipleCash: boolean = false;
  requestNewCashRegister(userData: any) {
    this.showLoadingCreateCash = true;
    this.inAnimationOrLoading = true;

    this.apiService.addCashRegister(userData)
      .pipe(
        catchError(error => {
          this.showLoadingCreateCash = false;
          this.showErroMultipleCash = true;

          if (error.status == 401) {
            setTimeout(() => {
              this.showErroMultipleCash = false;
              this.inAnimationOrLoading = false;
            }, 2000);
          }
          return EMPTY;
          // throw error;
        })
      )
      .subscribe(response => {
        this.showLoadingCreateCash = false;
        this.showfinishCreateCash = true;
        setTimeout(() => {
          this.requestShowCashRegisters();
          this.showListCashRegister = true;
          this.nameCashRegister = "";
          this.passCashRegister = "";
          this.inAnimationOrLoading = false;
          this.showfinishCreateCash = false;
        }, 2000);
      });
  }

  arrayCashRegisters: any = [];
  requestShowCashRegisters() {
    const userData = {
      user_id: this.authService.getInfoUser()?.owner_id,
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
        this.arrayCashRegisters = response.cashRegisters.map((register: any) => {
          return { ...register, selectBox: false };
        });

        // // default
        // this.arrayCashRegisters[0].selectBox = true;
        // this.cashRegisterSelect = this.arrayCashRegisters[0];
      });
  }

  arrayLatestCashSales: any;
  requestInfoAboutCashRegister() {
    const userData = {
      user_id: this.authService.getInfoUser()?.owner_id,
      cashRegisterSelect: this.cashRegisterSelect.cashRegister_id,
    };

    this.apiService.infoAboutCashRegister(userData)
      .pipe(
        catchError(error => {
          if (error.status == 401) {
            this.showTableLastSalesCashRegister = false;
            this.showErroInDashBoard = true;
            this.totalSalesCash = 0;
          }
          // return EMPTY;
          throw error;
        })
      )
      .subscribe(response => {
        this.showErroInDashBoard = false;
        this.showTableLastSalesCashRegister = true;
        this.arrayLatestCashSales = response.responseData;
        this.totalSalesCash = this.arrayLatestCashSales.data.length;
        this.updatePages();
      });
  }

  productData: any = [];
  requestAllProduct() {
    const userData = {
      user_id: this.authService.getInfoUser()?.owner_id,
    };

    this.apiService.showProductTable(userData)
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
        this.productData = response.products;
      });
  }

  showTableLastSalesCashRegister: boolean = false;
  showErroInDashBoard: boolean = false;
  currentPage: number = 1;
  totalSalesCash: number = 0;
  productsPerPage: number = 2;
  indexAcessProduct: any;
  pageMax: number = 0;
  updatePages() {
    // Calcular o índice inicial e final dos produtos a serem exibidos
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = Math.min(startIndex + this.productsPerPage, this.arrayLatestCashSales.data.length);

    this.indexAcessProduct = Array.from({ length: endIndex - startIndex }, (_, index) => startIndex + index);

    // Atualizar os números da página
    this.pageMax = Array.from({ length: Math.ceil(this.arrayLatestCashSales.data.length / this.productsPerPage) }, (_, index) => index + 1).length;
  }

  previousPage(isPreviousPage: boolean) {
    if (isPreviousPage) {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePages();
        // if (!this.isSearchProductTable) {
        //   this.showProductTable();
        // } else {
        //   this.searchProductTable();
        // }
      }
    }
    else {
      if (this.currentPage < this.pageMax) {
        this.currentPage++;
        this.updatePages();
        // if (!this.isSearchProductTable) {
        //   this.showProductTable();
        // } else {
        //   this.searchProductTable();
        // }
      }
    }
  }

  changeSelectBox(indexArray: any) {
    this.arrayCashRegisters.forEach((element: any) => {
      element.selectBox = false;
    });

    this.arrayCashRegisters[indexArray].selectBox = true;
    this.cashRegisterSelect = this.arrayCashRegisters[indexArray];

    const convertedArray = this.cashRegisterSelect.permissions.split(", ").map((element: string) => element === '1' ? true : false);
    this.permissions = convertedArray

    this.requestInfoAboutCashRegister();
  }
}
