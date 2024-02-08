import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-next-page-indicator',

  templateUrl: './next-page-indicator.component.html',
  styleUrl: './next-page-indicator.component.css'
})
export class NextPageIndicatorComponent {
  @Input() pageCurrent: any;
  @Input() pageMax: any;
  @Output() previousPage: EventEmitter<boolean> = new EventEmitter<boolean>();

  checkIndicatorNext(check: boolean): void {
    if (check) {
      if (this.pageCurrent < this.pageMax) {
        this.pageCurrent++;
        this.previousPage.emit(false);
      }
    } else {
      if (this.pageCurrent > 1) {
        this.pageCurrent--;
        this.previousPage.emit(true);
      };
    };
  };
}
