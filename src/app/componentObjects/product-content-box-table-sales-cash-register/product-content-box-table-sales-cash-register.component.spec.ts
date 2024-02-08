import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductContentBoxTableSalesCashRegisterComponent } from './product-content-box-table-sales-cash-register.component';

describe('ProductContentBoxTableSalesCashRegisterComponent', () => {
  let component: ProductContentBoxTableSalesCashRegisterComponent;
  let fixture: ComponentFixture<ProductContentBoxTableSalesCashRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductContentBoxTableSalesCashRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductContentBoxTableSalesCashRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
