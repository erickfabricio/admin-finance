import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionMainReportComponent } from './transaction-main-report.component';

describe('TransactionMainReportComponent', () => {
  let component: TransactionMainReportComponent;
  let fixture: ComponentFixture<TransactionMainReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionMainReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionMainReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
