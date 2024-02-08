import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table-row-tab',
  templateUrl: './table-row-tab.component.html',
  styleUrl: './table-row-tab.component.css'
})
export class TableRowTabComponent {
  // show Data
  @Input() productData: any;
  @Input() startIndex: any;

  nameProduct: string = "";
  codeProduct: string = "";
  priceProduct: string = "";
  discontProduct: string = "";
  max_quantity: number = 0;
  min_quantity: number = 0;
  descriptionProduct: string = "";
  nameImageProduct: string = "";

  ngOnInit(): void {
    this.nameProduct = this.productData[this.startIndex].product_name;
    this.codeProduct = this.productData[this.startIndex].product_code;
    this.priceProduct = this.productData[this.startIndex].price;
    this.discontProduct = this.productData[this.startIndex].discount;
    this.max_quantity = this.productData[this.startIndex].max_quantity;
    this.min_quantity = this.productData[this.startIndex].min_quantity;
    this.descriptionProduct = this.productData[this.startIndex].description;
    this.nameImageProduct = this.productData[this.startIndex].image_name;
  }

  // return actionWithIndexProduct
  @Output() jsonActionWithIndex: EventEmitter<any> = new EventEmitter();

  actionWithIndexProduct(action: any) {    
    this.jsonActionWithIndex.emit({ action: action, indexProduct: this.startIndex });
  }
}
