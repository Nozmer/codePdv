import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxContentBoxShowCashRegistersComponent } from './box-content-box-show-cash-registers.component';

describe('BoxContentBoxShowCashRegistersComponent', () => {
  let component: BoxContentBoxShowCashRegistersComponent;
  let fixture: ComponentFixture<BoxContentBoxShowCashRegistersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoxContentBoxShowCashRegistersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoxContentBoxShowCashRegistersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
