import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposeProductComponent } from './dispose-product.component';

describe('DisposeProductComponent', () => {
  let component: DisposeProductComponent;
  let fixture: ComponentFixture<DisposeProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisposeProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisposeProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
