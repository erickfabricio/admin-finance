import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionMainSearchComponent } from './transaction-main-search.component';

describe('TransactionMainSearchComponent', () => {
  let component: TransactionMainSearchComponent;
  let fixture: ComponentFixture<TransactionMainSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionMainSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionMainSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
