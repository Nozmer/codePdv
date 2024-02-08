import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-box-product-emission',

  templateUrl: './box-product-emission.component.html',
  styleUrl: './box-product-emission.component.css'
})
export class BoxProductEmissionComponent {
  // show Data
  @Input() productData: any;
  @Input() startIndex: any;

  nameProduct: string = "";
  priceProduct: string = "";
  nameImageProduct: string = "";

  ngOnInit(): void {
    this.nameProduct = this.productData[this.startIndex].product_name;
    this.priceProduct = this.productData[this.startIndex].price;
    this.nameImageProduct = this.productData[this.startIndex].image_name;
  }

  // send click with index 
  @Output() sendIndex: EventEmitter<number> = new EventEmitter<number>();
  clickSendIndex(){
    this.sendIndex.emit(this.startIndex);
  }
}
