import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxRecentActivityComponent } from './box-recent-activity.component';

describe('BoxRecentActivityComponent', () => {
  let component: BoxRecentActivityComponent;
  let fixture: ComponentFixture<BoxRecentActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoxRecentActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoxRecentActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
