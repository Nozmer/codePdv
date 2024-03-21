import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-box-select-permission',
  templateUrl: './box-select-permission.component.html',
  styleUrl: './box-select-permission.component.css'
})
export class BoxSelectPermissionComponent {
  @Output() permissionChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isSelect: boolean = false;

  select: boolean = false;

  // init
  ngOnInit(): void {
    this.select = this.isSelect;
  }

  activeClick() {
    this.select = !this.select;
    this.permissionChanged.emit(this.select);
  }
}
