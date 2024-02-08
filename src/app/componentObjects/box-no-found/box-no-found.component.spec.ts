import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxNoFoundComponent } from './box-no-found.component';

describe('BoxNoFoundComponent', () => {
  let component: BoxNoFoundComponent;
  let fixture: ComponentFixture<BoxNoFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoxNoFoundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoxNoFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
