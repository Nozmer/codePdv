import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextPageIndicatorComponent } from './next-page-indicator.component';

describe('NextPageIndicatorComponent', () => {
  let component: NextPageIndicatorComponent;
  let fixture: ComponentFixture<NextPageIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextPageIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NextPageIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
