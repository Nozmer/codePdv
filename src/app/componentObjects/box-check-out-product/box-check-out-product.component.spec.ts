import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxCheckOutProductComponent } from './box-check-out-product.component';

describe('BoxCheckOutProductComponent', () => {
  let component: BoxCheckOutProductComponent;
  let fixture: ComponentFixture<BoxCheckOutProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxCheckOutProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoxCheckOutProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
