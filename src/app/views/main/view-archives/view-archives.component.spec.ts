import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewArchivesComponent } from './view-archives.component';

describe('ViewArchivesComponent', () => {
  let component: ViewArchivesComponent;
  let fixture: ComponentFixture<ViewArchivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewArchivesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
