import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxShowErrorComponent } from './box-show-error.component';

describe('BoxShowErrorComponent', () => {
  let component: BoxShowErrorComponent;
  let fixture: ComponentFixture<BoxShowErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoxShowErrorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoxShowErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
