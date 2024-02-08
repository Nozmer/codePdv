import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxSelectPermissionComponent } from './box-select-permission.component';

describe('BoxSelectPermissionComponent', () => {
  let component: BoxSelectPermissionComponent;
  let fixture: ComponentFixture<BoxSelectPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxSelectPermissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoxSelectPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
