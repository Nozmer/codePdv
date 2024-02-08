import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuManageCashRegisterComponent } from './menu-manage-cash-register.component';

describe('MenuManageCashRegisterComponent', () => {
  let component: MenuManageCashRegisterComponent;
  let fixture: ComponentFixture<MenuManageCashRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuManageCashRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuManageCashRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
