import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportChoicesComponent } from './report-choices.component';

describe('ReportChoicesComponent', () => {
  let component: ReportChoicesComponent;
  let fixture: ComponentFixture<ReportChoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportChoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportChoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
