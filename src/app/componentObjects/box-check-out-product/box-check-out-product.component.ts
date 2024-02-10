import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-box-check-out-product',

  templateUrl: './box-check-out-product.component.html',
  styleUrl: './box-check-out-product.component.css'
})
export class BoxCheckOutProductComponent {
  // init
  @Input() productData: any;
  @Input() startIndex: any;

  nameProduct: string = "";
  priceProduct: string = "";
  codeProduct: string = "";
  nameImageProduct: string = "";

  ngOnInit(): void {
    this.nameProduct = this.productData[this.startIndex].product_name;
    this.priceProduct = this.productData[this.startIndex].price;
    this.codeProduct = this.productData[this.startIndex].product_code;
    this.nameImageProduct = this.productData[this.startIndex].image_name;
  }

  // add
  @Input() numberQuantity: number = 1;
  @Output() isRemoving: EventEmitter<any> = new EventEmitter();

  addValueNumber(value: boolean): void {
    if (value) {
      this.numberQuantity++;
      const reponse = {
        index: this.startIndex,
        isRemoving: false
      }
      this.isRemoving.emit(reponse);
    } else {
      if (this.numberQuantity > 1) {
        this.numberQuantity--;
        const reponse = {
          index: this.startIndex,
          isRemoving: true
        }
        this.isRemoving.emit(reponse);
      };
    }
  };
}
