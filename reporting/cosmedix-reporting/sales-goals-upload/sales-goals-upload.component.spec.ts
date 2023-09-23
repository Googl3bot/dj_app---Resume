import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesGoalsUploadComponent } from './sales-goals-upload.component';

describe('SalesGoalsUploadComponent', () => {
  let component: SalesGoalsUploadComponent;
  let fixture: ComponentFixture<SalesGoalsUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesGoalsUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesGoalsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
