import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-content-box-table-sales-cash-register',

  templateUrl: './product-content-box-table-sales-cash-register.component.html',
  styleUrl: './product-content-box-table-sales-cash-register.component.css'
})
export class ProductContentBoxTableSalesCashRegisterComponent {
  @Input() idProduct: any;
  @Input() productSold: any;
  @Input() productData: any;
  @Input() quantitityProduct: any;
  @Input() startIndex: any;

  nameProduct: string = "";
  priceProduct: string = "";
  imageProduct: string = "";
  quantityProduct: string = "";

  ngOnInit(): void {
    const index = this.productData.findIndex((item: any) => item.product_id == this.idProduct);    

    this.nameProduct = this.productData[index].product_name;
    this.priceProduct = this.formatCurrency(parseFloat(this.productData[index].price));
    this.imageProduct = this.productData[index].image_name;
    
    this.quantityProduct = this.quantitityProduct[this.startIndex];
  }

  formatCurrency(amount: number) {
    const formattedAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);

    return formattedAmount;
  }
}
