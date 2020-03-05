import { Component, OnInit, Input } from '@angular/core';
import { UserModel } from 'src/app/entity/models/user.model';
import { PrivilegeCollectionModel } from 'src/app/entity/models/privilege.collection.model';

@Component({
  selector: 'admin-entity-transaction-main-report',
  templateUrl: './transaction-main-report.component.html',
  styleUrls: ['./transaction-main-report.component.css']
})
export class TransactionMainReportComponent implements OnInit {

  //Session
  @Input('userSession') userSession: UserModel;
  @Input('privilegeCollectionSession') privilegeCollectionSession: PrivilegeCollectionModel;
  
  constructor() { }

  ngOnInit() {
  }

}
