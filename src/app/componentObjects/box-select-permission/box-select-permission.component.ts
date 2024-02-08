import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-box-select-permission',
  templateUrl: './box-select-permission.component.html',
  styleUrl: './box-select-permission.component.css'
})
export class BoxSelectPermissionComponent {  
  @Output() permissionChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  select: boolean = false;

  activeClick() {    
    this.select = !this.select;
    this.permissionChanged.emit(this.select);
  }
}
