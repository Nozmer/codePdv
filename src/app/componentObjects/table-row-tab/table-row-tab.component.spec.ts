import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRowTabComponent } from './table-row-tab.component';

describe('TableRowTabComponent', () => {
  let component: TableRowTabComponent;
  let fixture: ComponentFixture<TableRowTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableRowTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableRowTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
