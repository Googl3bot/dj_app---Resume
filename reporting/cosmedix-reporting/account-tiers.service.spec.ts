import { TestBed } from '@angular/core/testing';

import { AccountTiersService } from './account-tiers.service';

describe('AccountTiersService', () => {
  let service: AccountTiersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountTiersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
