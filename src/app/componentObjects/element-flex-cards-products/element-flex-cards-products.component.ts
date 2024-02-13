import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-element-flex-cards-products',
  templateUrl: './element-flex-cards-products.component.html',
  styleUrl: './element-flex-cards-products.component.css'
})
export class ElementFlexCardsProductsComponent {
  @Input() productData: any;
  @Input() quantityData: any;
  @Input() startIndex: any;

  nameProduct: string = "";
  imageName: string = "";
  numberQuantity: number = 0;

  ngOnInit(): void {
    const indexAcess = this.productData.findIndex((item: any) => item.product_id === this.startIndex);
    this.nameProduct = this.productData[indexAcess].product_name;
    this.imageName = this.productData[indexAcess].image_name;
    this.numberQuantity = this.quantityData;
  }

} 
