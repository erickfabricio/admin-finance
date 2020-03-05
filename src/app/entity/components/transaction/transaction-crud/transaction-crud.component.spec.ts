import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCrudComponent } from './transaction-crud.component';

describe('TransactionCrudComponent', () => {
  let component: TransactionCrudComponent;
  let fixture: ComponentFixture<TransactionCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
