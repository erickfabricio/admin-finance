import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';
import { TransactionCrudComponent } from '../transaction-crud/transaction-crud.component';
import { UserModel } from 'src/app/entity/models/user.model';
import { PrivilegeCollectionModel } from 'src/app/entity/models/privilege.collection.model';

@Component({
  selector: 'admin-entity-transaction-main',
  templateUrl: './transaction-main.component.html',
  styleUrls: ['./transaction-main.component.css']
})
export class TransactionMainComponent implements OnInit {

  @ViewChild("tabGroup", { static: true }) tabGroup;
  @ViewChild("tabList", { static: true }) tabList;
  @ViewChild("list", { static: true }) list: TransactionListComponent;
  @ViewChild("tabCrud", { static: true }) tabCrud;
  @ViewChild("crud", { static: true }) crud: TransactionCrudComponent;
  view: string;

  //Session
  @Input('userSession') userSession: UserModel;
  @Input('privilegeCollectionSession') privilegeCollectionSession: PrivilegeCollectionModel;

  constructor() { }

  ngOnInit() {
    this.view = "LIST";
    this.captureEventList();
    this.captureEventCrud();    
  }

  captureEventList() {
    this.list.eventCrud.pipe().subscribe(data => {
      //Data      
      //console.transaction(data.action);
      //console.transaction(data.transaction);

      //Send data to CRUD
      this.crud.action = data.action;
      this.crud.transaction = data.transaction;
      this.crud.show();
      
      //Change and enable tag      
      if (data.action == "CRUD") {
        this.tabCrud.textLabel = "Transacción: " + data.transaction._id;
      } else {
        this.tabCrud.textLabel = "Nueva transacción";
      }
      
      this.tabCrud.disabled = false;
      this.tabGroup.selectedIndex = 1;

      

      //Show mat-tab-header
      this.view = "CRUD";

    });
  }

  captureEventCrud() {
    this.crud.eventUpdateList.pipe().subscribe(isUpdateList => {
      //Data
      //console.transaction("Update list:" + isUpdateList);
      
      if (isUpdateList) {
        this.list.find();
      };

      if (this.crud.action == "DELETE") {
        this.tabGroup.selectedIndex = 0;
      }
      
    });    
  }

  onChangeTab(event: MatTabChangeEvent) {
    //console.transaction("Tag change:" + event.tab.textLabel);
    if (this.tabGroup.selectedIndex == 0) {
      this.tabCrud.textLabel = "";
      this.tabCrud.disabled = true;
      this.view = "LIST";
    }
  }  

}
