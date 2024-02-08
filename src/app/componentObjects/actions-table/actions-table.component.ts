import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-actions-table',

  templateUrl: './actions-table.component.html',
  styleUrl: './actions-table.component.css'
})
export class ActionsTableComponent {
  @Output() actionEdit: EventEmitter<boolean> = new EventEmitter<boolean>();

  actionClick(actionEdit: boolean) {
    if (actionEdit) {
      this.actionEdit.emit(true);
    } else {
      this.actionEdit.emit(false);
    }
  }

}
