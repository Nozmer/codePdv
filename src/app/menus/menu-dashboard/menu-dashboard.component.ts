import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-menu-dashboard',
  templateUrl: './menu-dashboard.component.html',
  styleUrl: './menu-dashboard.component.css'
})
export class MenuDashboardComponent implements OnInit {
  constructor(private apiService: ApiService) { }

  // init
  ngOnInit(): void {
    // default
    this.showProductTable();
    this.requestSalesStatistics();
  }

  // get productData
  productData: any = [];

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
      });
  }

  // get salesStatistics
  lenghtHourlySales: number = 0;
  dataHourlySales: any = [];
  hourlySalesProducts: any = [];

  lenghtDailySales: number = 0;
  dataDailySales: any = [];
  dailySalesProducts: any = [];

  lenghtMonthlySales: number = 0;
  dataMonthlySales: any = [];
  monthlySalesProducts: any = [];

  requestSalesStatistics() {
    const userData = {
      user_id: 1,
    };

    this.apiService.salesStatistics(userData)
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
        this.dataHourlySales = response.hourlySales.map((item: any) => item.salesCount);
        this.hourlySalesProducts = response.hourlySalesProducts; 
        this.lenghtHourlySales = this.dataHourlySales.reduce((acc: any, item:any) => acc + item, 0);

        this.dataDailySales = response.dailySales.map((item: any) => item.salesCount);
        this.dailySalesProducts = response.dailySalesProducts;
        this.lenghtDailySales = this.dataDailySales.reduce((acc: any, item:any) => acc + item, 0);

        this.dataMonthlySales = response.monthlySales.map((item: any) => item.salesCount);
        this.monthlySalesProducts = response.monthlySalesProducts;
        this.lenghtMonthlySales = this.dataMonthlySales.reduce((acc: any, item:any) => acc + item, 0);

        this.createChart(); 
        this.changeInfoPeriodical(1);
      });
  }

  // optionSelectPeriodical
  lenghtSales: number = 0;
  optionSelectPeriodical: number = 1;
  data: any = [];

  changeInfoPeriodical(option: number) {
    if (option == 1) {
      this.label = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
        '22:00', '23:00'];
      this.data = this.dataHourlySales;
      this.lenghtSales = this.lenghtHourlySales;
      this.sendTopSellingProducts(this.hourlySalesProducts);
    } else if (option == 2) {
      this.label = [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
      ];
      this.data = this.dataDailySales;
      this.lenghtSales = this.lenghtDailySales;
      this.sendTopSellingProducts(this.dailySalesProducts);
    } else {
      this.label =
        ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      this.data = this.dataMonthlySales;
      this.lenghtSales = this.lenghtMonthlySales;
      this.sendTopSellingProducts(this.monthlySalesProducts);
    }

    this.optionSelectPeriodical = option;
    this.addData(this.chart, this.label, this.data);
  }

  // insert top selling products
  showWhichID: any = [];
  showWhichQuantity: any = [];

  sendTopSellingProducts(showWhich: any){
    if (showWhich.topProductIDs) {
      this.showWhichID = showWhich.topProductIDs.slice(0, 3);
      this.showWhichQuantity = showWhich.topProductQuantities.slice(0, 3);
    } else{
      this.showWhichID = [];
      this.showWhichQuantity = [];
    }
  }

  // chart
  @ViewChild('lineChart', { static: true }) private chartRef: any;
  chart: any;
  label: any = [];

  createChart() {
    const ctx: CanvasRenderingContext2D = this.chartRef.nativeElement.getContext('2d')!;
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, "rgba(120, 160, 237, 0.3)");
    gradientFill.addColorStop(1, "rgba(217, 217, 217, 0)");

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00',
          '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
          '22:00', '23:00'],
        datasets: [
          {
            label: "Vendas",
            data: this.dataHourlySales,
            backgroundColor: gradientFill,
            pointBackgroundColor: '#78A0ED',
            borderColor: '#78A0ED',
            tension: 0.4,
            borderWidth: 3,
            fill: true,
          }
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }

  addData(chart: any, label: any, newData: any) {
    chart.data.labels = label;
    chart.data.datasets[0].data = newData;
    chart.update();
  }
}
