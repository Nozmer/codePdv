import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';

// menus
import { MenuDashboardComponent } from "./menus/menu-dashboard/menu-dashboard.component";
import { MenuEmissionProductComponent } from "./menus/menu-emission-product/menu-emission-product.component";
import { MenuManageProductsComponent } from "./menus/menu-manage-products/menu-manage-products.component";
import { MenuManageCashRegisterComponent } from "./menus/menu-manage-cash-register/menu-manage-cash-register.component";
import { LoginComponent } from './login/login.component';

// componentObjects
import { ElementFlexCardsProductsComponent } from './componentObjects/element-flex-cards-products/element-flex-cards-products.component';
import { NextPageIndicatorComponent } from "./componentObjects/next-page-indicator/next-page-indicator.component";
import { BoxProductEmissionComponent } from "./componentObjects/box-product-emission/box-product-emission.component";
import { BoxCheckOutProductComponent } from "./componentObjects/box-check-out-product/box-check-out-product.component";
import { ActionsTableComponent } from "./componentObjects/actions-table/actions-table.component";
import { BoxSelectPermissionComponent } from "./componentObjects/box-select-permission/box-select-permission.component";
import { BoxTableSalesCashRegisterComponent } from "./componentObjects/box-table-sales-cash-register/box-table-sales-cash-register.component";
import { ProductContentBoxTableSalesCashRegisterComponent } from './componentObjects/product-content-box-table-sales-cash-register/product-content-box-table-sales-cash-register.component';
import { TableRowTabComponent } from "./componentObjects/table-row-tab/table-row-tab.component";
import { BoxNoFoundComponent } from './componentObjects/box-no-found/box-no-found.component';
import { PopupDeleteProductComponent } from './componentObjects/popup-delete-product/popup-delete-product.component';
import { LogMessagePanelComponent } from './componentObjects/log-message-panel/log-message-panel.component';
import { BoxRecentActivityComponent } from './componentObjects/box-recent-activity/box-recent-activity.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuDashboardComponent,
    MenuEmissionProductComponent,
    MenuManageProductsComponent,
    MenuManageCashRegisterComponent,
    LoginComponent,
    // componentObjects
    ElementFlexCardsProductsComponent,
    NextPageIndicatorComponent,
    BoxProductEmissionComponent,
    BoxCheckOutProductComponent,
    ActionsTableComponent,
    BoxSelectPermissionComponent,
    BoxTableSalesCashRegisterComponent,
    ProductContentBoxTableSalesCashRegisterComponent,
    TableRowTabComponent,
    BoxNoFoundComponent,
    PopupDeleteProductComponent,
    LogMessagePanelComponent,
    BoxRecentActivityComponent
  ],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        allowedDomains: ['your-backend-domain.com'],
      },
    }),
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
