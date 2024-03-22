import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTransactionStatusComponent } from './update-transaction-status.component';

describe('UpdateTransactionStatusComponent', () => {
  let component: UpdateTransactionStatusComponent;
  let fixture: ComponentFixture<UpdateTransactionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTransactionStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTransactionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
