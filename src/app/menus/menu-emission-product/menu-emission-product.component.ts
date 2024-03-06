import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { AuthService } from '../../auth.service';
// rxjs
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-menu-emission-product',
  templateUrl: './menu-emission-product.component.html',
  styleUrl: './menu-emission-product.component.css'
})
export class MenuEmissionProductComponent {
  constructor(private apiService: ApiService, private authService: AuthService) { };

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
    } else {
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
    if (this.productData != undefined) {
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
        if (this.productData.length > this.productsPerPage) {
          this.indexAcessProduct = Array.from({ length: this.productsPerPage }, (_, index) => index);
        } else {
          this.indexAcessProduct = Array.from({ length: this.productData.length }, (_, index) => index);
        }
        this.correspondingProducts = [];
      }
    }
  }

  showProductTable() {
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
  finishPayment: boolean = false;
  optionBallStatus: number = 0;

  goPayment(goPayment: boolean) {
    if (this.arrayIn_boxCheckOutProducts.length > 0) {
      if (goPayment) {
        this.showPaymentBox = true;
        if (this.showPaymentBox && this.optionSelect > 0) {
          const priceTotalConvert = parseFloat(this.price_total.replace(',', '.'));
          const discountSubConvert = parseFloat(this.discount_subtotal.replace(',', '.'));
          const arrayProductID = this.arrayIn_boxCheckOutProducts.map((index: any) => this.productData[index].product_id);

          const userData = {
            owner_id: this.authService.getInfoUser()?.owner_id,
            isCashRegister_id	: this.authService.getInfoUser()?.isCashRegister_id	,
            payment_method: this.optionSelect,
            amount: priceTotalConvert,
            discount: discountSubConvert,
            arrayProductID: arrayProductID,
            numberQuantity: this.numberQuantity
          };
          
          this.apiService.addPayment(userData)
            .pipe(
              catchError(error => {
                return EMPTY;
                // throw error;
              })
            )
            .subscribe(response => {
              if (response.status == "ok") {
                this.finishPayment = true;

                // back default
                this.optionSelect = 0;
                this.showSelectProduct = false;
                this.showPaymentBox = false;
                this.arrayIn_boxCheckOutProducts = [];
                this.numberQuantity = [];
                this.price_total = "0,00";
                this.price_subtotal = "0,00";
                this.discount_subtotal = "0,00";

                this.optionBallStatus = 1;

                setTimeout(() => {
                  this.optionBallStatus = 2;
                }, 900);

                setTimeout(() => {
                  this.optionBallStatus = 3;
                }, 1700);

                setTimeout(() => {
                  this.optionBallStatus = 0;
                  this.finishPayment = false;
                }, 3000);
              }
            });
        }

      } else {
        this.optionSelect = 0;
        this.showPaymentBox = false;
      }
    }
  }
}


