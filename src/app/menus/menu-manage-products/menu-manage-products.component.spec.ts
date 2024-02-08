import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuManageProductsComponent } from './menu-manage-products.component';

describe('MenuManageProductsComponent', () => {
  let component: MenuManageProductsComponent;
  let fixture: ComponentFixture<MenuManageProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuManageProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuManageProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
