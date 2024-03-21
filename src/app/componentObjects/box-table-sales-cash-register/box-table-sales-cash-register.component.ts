import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-box-table-sales-cash-register',
  templateUrl: './box-table-sales-cash-register.component.html',
  styleUrl: './box-table-sales-cash-register.component.css'
})
export class BoxTableSalesCashRegisterComponent {
  @Input() productData: any;
  @Input() arrayLatestCashSales: any;
  @Input() startIndex: any;

  data: string = "";
  hourData: string = "";
  countProduct: string = "";
  totalAmountProducts: string = "";
  quantitityProducts: any = [];
  typePagament: string = "";

  productsSold: number = 0;
  idProducts: any = [];

  // const responseData = {
  //   data: [],
  //   productsSold: [],
  //   idProducts: [],
  //   totalAmountProducts: [],
  //   quantitityProducts: [],
  // };

  ngOnInit(): void {
    const dataString = this.arrayLatestCashSales.data[this.startIndex];
    const totalAmountProducts =  this.arrayLatestCashSales.totalAmountProducts[this.startIndex];
    const productsSold = this.arrayLatestCashSales.productsSold[this.startIndex];
    const quantitityProducts = this.arrayLatestCashSales.quantitityProducts[this.startIndex].split(',');
    const idProducts = this.arrayLatestCashSales.idProducts[this.startIndex].split(',');
    const typesPagaments = ["Pix", "Dinheiro", "Cartão"];    

    this.data = this.formatData(dataString);
    this.hourData = this.formatHour(dataString);

    this.totalAmountProducts = this.formatCurrency(totalAmountProducts);
    this.countProduct = idProducts.length;

    this.productsSold = productsSold;
    this.idProducts = idProducts;
    this.quantitityProducts = quantitityProducts;

    this.typePagament = typesPagaments[this.arrayLatestCashSales.typePagament[this.startIndex] - 1];
  }

  formatData(dataString: string) {
    const data = new Date(dataString);

    const day = String(data.getDate()).padStart(2, '0');
    const mounth = String(data.getMonth() + 1).padStart(2, '0');
    const year = data.getFullYear();

    return `${day}/${mounth}/${year}`;
  }

  formatHour(dataString: string) {
    const data = new Date(dataString);

    const hour = String(data.getHours()).padStart(2, '0');
    const minutes = String(data.getMinutes()).padStart(2, '0');

    return `${hour}:${minutes}`;
  }

  formatCurrency(amount: number) {
    const formattedAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);

    return formattedAmount;
  }
}
