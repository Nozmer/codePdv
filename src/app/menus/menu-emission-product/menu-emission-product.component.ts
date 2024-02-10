import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../api.service';
// rxjs
import { catchError, concatMap, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { isUndefined } from 'util';


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
  numberQuantity: any = [];

  sendProductEmisson(indexProduct: number) {
    if (!this.showPaymentBox) {
      if (!this.arrayIn_boxCheckOutProducts.includes(indexProduct)) {
        this.showSelectProduct = false;
        this.arrayIn_boxCheckOutProducts.push(indexProduct);
        this.numberQuantity.push(1);
        this.checkoutCalculation(indexProduct, false);
      }
      else {
        this.checkoutCalculation(indexProduct, true);
      }
    }
  }

  // checkout calculation
  price_total: string = "0,00";
  price_subtotal: string = "0,00";
  discount_subtotal: string = "0,00";

  checkoutCalculation(indexProduct: any, sameProduct: boolean, isRemoving?: boolean) {
    // covert string to number
    let priceTotalConvert = parseFloat(this.price_total.replace(',', '.'));
    let priceSubConvert = parseFloat(this.price_subtotal.replace(',', '.'));
    let discountSubConvert = parseFloat(this.discount_subtotal.replace(',', '.'));

    const product = this.productData[indexProduct];

    const price = parseFloat(product.price.replace(',', '.'));
    const discountPercentage = parseFloat(product.discount);

    const discountAmount = (price * discountPercentage) / 100;
    const total = price - discountAmount;
    const subtotal = price;

    // += -=
    if (isRemoving) {
      priceTotalConvert -= total;
      priceSubConvert -= subtotal;
      discountSubConvert -= discountAmount;
    } else{
      priceTotalConvert += total;
      priceSubConvert += subtotal;
      discountSubConvert += discountAmount;  
    }

    // formatted
    const formattedTotal = priceTotalConvert.toFixed(2).replace('.', ',');
    const formattedSubtotal = priceSubConvert.toFixed(2).replace('.', ',');
    const formattedDiscount = discountSubConvert.toFixed(2).replace('.', ',');

    this.price_total = formattedTotal;
    this.price_subtotal = formattedSubtotal;
    this.discount_subtotal = formattedDiscount;

    // add +1 if same product or add from isRemoving
    if (sameProduct) {
      const indexOfProduct = this.arrayIn_boxCheckOutProducts.indexOf(indexProduct);
      this.numberQuantity[indexOfProduct] = this.numberQuantity[indexOfProduct] += 1;
    }

    // add -1 if isRemoving
    if (isRemoving) {
      const indexOfProduct = this.arrayIn_boxCheckOutProducts.indexOf(indexProduct);
      this.numberQuantity[indexOfProduct] = this.numberQuantity[indexOfProduct] - 1;
    }
  }

  isRemoving(isRemoving: any) {
    if (isRemoving.isRemoving) {
      this.checkoutCalculation(isRemoving.index, false, isRemoving.isRemoving);
    } else {      
      this.checkoutCalculation(isRemoving.index, true);
    }
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
  showSelectProduct: boolean = true;

  goPayment(goPayment: boolean) {
    if (this.arrayIn_boxCheckOutProducts.length > 0) {
      if (goPayment) {
        this.showPaymentBox = true;
      } else {
        this.showPaymentBox = false;
      }
    }
  }
}
