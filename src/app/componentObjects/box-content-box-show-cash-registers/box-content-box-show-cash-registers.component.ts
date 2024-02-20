import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-box-content-box-show-cash-registers',
  templateUrl: './box-content-box-show-cash-registers.component.html',
  styleUrl: './box-content-box-show-cash-registers.component.css'
})
export class BoxContentBoxShowCashRegistersComponent {
  @Input() dataRegister: any;

  // init
  name: string = "";

  ngOnInit(): void {
    this.name = this.dataRegister.name;
  }

}
