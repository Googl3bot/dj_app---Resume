import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CosmedixReportingComponent } from './cosmedix-reporting.component';

describe('CosmedixReportingComponent', () => {
  let component: CosmedixReportingComponent;
  let fixture: ComponentFixture<CosmedixReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CosmedixReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CosmedixReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
