import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogMessagePanelComponent } from './log-message-panel.component';

describe('LogMessagePanelComponent', () => {
  let component: LogMessagePanelComponent;
  let fixture: ComponentFixture<LogMessagePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogMessagePanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogMessagePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
