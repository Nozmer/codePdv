import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEmissionProductComponent } from './menu-emission-product.component';

describe('MenuEmissionProductComponent', () => {
  let component: MenuEmissionProductComponent;
  let fixture: ComponentFixture<MenuEmissionProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuEmissionProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuEmissionProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
