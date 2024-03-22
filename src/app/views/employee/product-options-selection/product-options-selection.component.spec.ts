import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOptionsSelectionComponent } from './product-options-selection.component';

describe('ProductOptionsSelectionComponent', () => {
  let component: ProductOptionsSelectionComponent;
  let fixture: ComponentFixture<ProductOptionsSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductOptionsSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductOptionsSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
