import { Component, Output, EventEmitter } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { ApiService } from '../../api.service';
import { DataService } from '../../data-service.service';

@Component({
  selector: 'app-popup-delete-product',
  templateUrl: './popup-delete-product.component.html',
  styleUrl: './popup-delete-product.component.css'
})
export class PopupDeleteProductComponent {
  constructor(private dataService: DataService, private apiService: ApiService) { }

  // init
  nameProduct: string = "";
  codeProduct: string = "";
  nameImageProduct: string = "";
  product_id: number = 0;

  ngOnInit() {
    this.dataService.dataProductToPopUpDelete.subscribe((productData) => {
      this.nameProduct = productData.product_name;
      this.codeProduct = productData.product_code;
      this.nameImageProduct = productData.image_name;
      this.product_id = productData.product_id;
    });
  }

  // closePopUp
  @Output() closePopUp: EventEmitter<any> = new EventEmitter();
  clickClosePopUp() {
    this.closePopUp.emit(false);
  }

  // deleteProduct
  deleteProduct() {
    const userData = {
      product_id: this.product_id,
    };

    this.apiService.removeProduct(userData)
      .pipe(
        catchError(error => {
          if (error.status == 401) {
            console.log("produto não encontrado");
            return EMPTY;
          }
          throw error;
        })
      )
      .subscribe(response => {
        const dataMessageLog = {
          dataMessage: "Produto removido: " + this.nameProduct,
          pathImageName: this.nameImageProduct,
        };
        this.dataService.messageToLogMessage.emit(dataMessageLog);

        this.closePopUp.emit(true);
      });
  }
}
