import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxTableSalesCashRegisterComponent } from './box-table-sales-cash-register.component';

describe('BoxTableSalesCashRegisterComponent', () => {
  let component: BoxTableSalesCashRegisterComponent;
  let fixture: ComponentFixture<BoxTableSalesCashRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxTableSalesCashRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoxTableSalesCashRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
