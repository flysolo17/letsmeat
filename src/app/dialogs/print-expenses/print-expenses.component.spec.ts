import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintExpensesComponent } from './print-expenses.component';

describe('PrintExpensesComponent', () => {
  let component: PrintExpensesComponent;
  let fixture: ComponentFixture<PrintExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintExpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
