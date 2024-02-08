import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementFlexCardsProductsComponent } from './element-flex-cards-products.component';

describe('ElementFlexCardsProductsComponent', () => {
  let component: ElementFlexCardsProductsComponent;
  let fixture: ComponentFixture<ElementFlexCardsProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementFlexCardsProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElementFlexCardsProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
