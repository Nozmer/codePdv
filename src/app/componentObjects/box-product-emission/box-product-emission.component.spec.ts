import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxProductEmissionComponent } from './box-product-emission.component';

describe('BoxProductEmissionComponent', () => {
  let component: BoxProductEmissionComponent;
  let fixture: ComponentFixture<BoxProductEmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxProductEmissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoxProductEmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
