import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTiersComponent } from './account-tiers.component';

describe('AccountTiersComponent', () => {
  let component: AccountTiersComponent;
  let fixture: ComponentFixture<AccountTiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountTiersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
