import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuficientStocksComponent } from './insuficient-stocks.component';

describe('InsuficientStocksComponent', () => {
  let component: InsuficientStocksComponent;
  let fixture: ComponentFixture<InsuficientStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuficientStocksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuficientStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
