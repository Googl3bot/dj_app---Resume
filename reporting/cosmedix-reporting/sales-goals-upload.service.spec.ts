import { TestBed } from '@angular/core/testing';

import { SalesGoalsUploadService } from './sales-goals-upload.service';

describe('SalesGoalsUploadService', () => {
  let service: SalesGoalsUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesGoalsUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
