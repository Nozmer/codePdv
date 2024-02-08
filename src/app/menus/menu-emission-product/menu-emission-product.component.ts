import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../api.service';
// rxjs
import { catchError, concatMap, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';


@Component({
  selector: 'app-menu-emission-product',
  templateUrl: './menu-emission-product.component.html',
  styleUrl: './menu-emission-product.component.css'
})
export class MenuEmissionProductComponent {
  constructor(private apiService: ApiService) { }

  // init
  ngOnInit(): void {
    this.showProductTable();
  }

  // sendProductEmisson
  arrayIn_boxCheckOutProducts: any = [];

  sendProductEmisson(indexProduct: number) {
    if (!this.arrayIn_boxCheckOutProducts.includes(indexProduct)) {
      this.arrayIn_boxCheckOutProducts.push(indexProduct);
    }
  }
  
  // checkout calculation
  checkoutCalculation(product: any){
    
  }

  // searchProductTable and show
  public productData: any;
  currentPage: number = 1;
  productsPerPage: number = 6;
  indexAcessProduct: any;
  pageMax: number = 0;

  searchProductTableInput: string = "";
  correspondingProducts: any = [];
  isSearchProductTable: boolean = false;

  searchProductTable() {
    if (this.searchProductTableInput != "") {
      this.isSearchProductTable = true;
      const produtosArray = Object.values(this.productData);

      this.correspondingProducts = produtosArray
        .map((produto: any, index: number) =>
          produto.product_name.toLowerCase().includes(this.searchProductTableInput.toLowerCase()) ? index : undefined
        )
        .filter(index => index !== undefined);

      const startIndex = (this.currentPage - 1) * this.productsPerPage;
      const endIndex = Math.min(startIndex + this.productsPerPage, this.correspondingProducts.length);

      this.indexAcessProduct = this.correspondingProducts.slice(startIndex, endIndex);
      this.pageMax = Math.ceil(this.correspondingProducts.length / this.productsPerPage);
    } else {
      this.isSearchProductTable = false;
      this.indexAcessProduct = [0, 1, 2, 3];
      this.correspondingProducts = [];
    }
  }

  showProductTable() {
    const userData = {
      user_id: 1,
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

        // Calcular o índice inicial e final dos produtos a serem exibidos
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = Math.min(startIndex + this.productsPerPage, this.productData.length);

        this.indexAcessProduct = Array.from({ length: endIndex - startIndex }, (_, index) => startIndex + index);

        // Atualizar os números da página
        this.pageMax = Array.from({ length: Math.ceil(this.productData.length / this.productsPerPage) }, (_, index) => index + 1).length;
      });
  }

  previousPage(isPreviousPage: boolean) {
    if (isPreviousPage) {
      if (this.currentPage > 1) {
        this.currentPage--;
        if (!this.isSearchProductTable) {
          this.showProductTable();
        } else {
          this.searchProductTable();
        }
      }
    }
    else {
      if (this.currentPage < this.pageMax) {
        this.currentPage++;
        if (!this.isSearchProductTable) {
          this.showProductTable();
        } else {
          this.searchProductTable();
        }
      }
    }
  }

  // choice options
  clickInPix: boolean = false;
  optionSelect: number = 0;

  selectOptions(numberSelect: number) {
    this.optionSelect = numberSelect;
    if (numberSelect == 1) {
      this.clickInPix = true;
    } else {
      this.clickInPix = false;
    }
  }

  // goPayment
  showPaymentBox: boolean = false;
  goPayment(goPayment: boolean) {
    if (goPayment) {
      this.showPaymentBox = true;
    } else {
      this.showPaymentBox = false;
    }
  }
}
