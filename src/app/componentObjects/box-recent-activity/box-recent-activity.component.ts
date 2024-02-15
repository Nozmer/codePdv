import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-box-recent-activity',
  templateUrl: './box-recent-activity.component.html',
  styleUrl: './box-recent-activity.component.css'
})
export class BoxRecentActivityComponent {
  @Input() data: any;

  whichActive: number = 0;  // 1 product, 2 payment

  imageName: string = "";
  contentInfoText: string = "";
  formatData: string = "";
  formatHour: string = "";

  ngOnInit(): void {
    if (this.data.product_id) {
      this.whichActive = 1;

      const dataNew = new Date(this.data.created_at);
      this.imageName = this.data.image_name;
      this.contentInfoText = this.data.product_name;
      this.formatData = dataNew.toLocaleDateString('pt-BR');
      this.formatHour = dataNew.toLocaleTimeString('pt-BR');    
      
    } else if (this.data.payment_id) {
      this.whichActive = 2;

      const dataNew = new Date(this.data.payment_date);
      this.imageName = "cashRegister_icon.svg";
      this.contentInfoText = "R$" + this.data.amount;
      this.formatData = dataNew.toLocaleDateString('pt-BR');
      this.formatHour = dataNew.toLocaleTimeString('pt-BR');
    }
  }
}
