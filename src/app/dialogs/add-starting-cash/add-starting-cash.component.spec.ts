import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStartingCashComponent } from './add-starting-cash.component';

describe('AddStartingCashComponent', () => {
  let component: AddStartingCashComponent;
  let fixture: ComponentFixture<AddStartingCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStartingCashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStartingCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
