import { Component } from '@angular/core';


@Component({
  selector: 'app-menu-manage-cash-register',
  templateUrl: './menu-manage-cash-register.component.html',
  styleUrl: './menu-manage-cash-register.component.css'
})
export class MenuManageCashRegisterComponent {
  isBack: boolean = false;

  // selectBoxCashRegister
  boxSelectCashRegister: number = 0;
  changeBoxSelectCashRegister(numbeSelect: number): void {
    this.boxSelectCashRegister = numbeSelect;
  }

  // changeToPermissionOrDashboard
  selectTab: number = 0;
  changeTabsEdit(numberSelectTab: number): void{
    this.selectTab = numberSelectTab;
  }

  // selects permissions in partEdit_box_infoAboutCashRegister
  permissions: boolean[] = new Array(4).fill(false); // ou ajuste o tamanho conforme necessário

  onPermissionChanged(activated: boolean, index: number): void {
    this.permissions[index] = activated;
  }
}
