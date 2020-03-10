import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EntityService } from 'src/app/entity/services/entity.service';
import { TransactionModel } from 'src/app/entity/models/transaction.model';
import { UserModel } from 'src/app/entity/models/user.model';
import { PrivilegeCollectionModel } from 'src/app/entity/models/privilege.collection.model';
import { CatalogModel } from 'src/app/entity/models/catalog.model';
import { ItemModel } from 'src/app/entity/models/item.model';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'admin-entity-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {

  //Filter
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[];
  dataSource: MatTableDataSource<TransactionModel>;

  //List
  transactions: TransactionModel[];

  //Catalogs
  catalogTransactionType: CatalogModel = new CatalogModel();
  catalogTransactionCategory: CatalogModel = new CatalogModel();
  catalogTransactionAccount: CatalogModel = new CatalogModel();

  //Session
  @Input('userSession') userSession: UserModel;
  @Input('privilegeCollectionSession') privilegeCollectionSession: PrivilegeCollectionModel;

  constructor(private entityService: EntityService) { }

  ngOnInit() {
    this.displayedColumns = ['#', 'description', 'type', 'category', 'account', 'amount', 'date'];
    this.dataSource = new MatTableDataSource<TransactionModel>();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getCatalogs();
    this.find();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  find() {
    this.entityService.find(TransactionModel.entity)
      .subscribe(transactions => {
        this.transactions = <TransactionModel[]>transactions;
        this.dataSource.data = this.transactions;
      });
  }

  getCatalogs() {
    //Type
    this.entityService.findEntityById(CatalogModel.entity, environment.catalogTransactionType)
      .subscribe(catalogModel => {
        this.catalogTransactionType = <CatalogModel>catalogModel; /*console.log(catalogModel);*/
      });

    //Category
    this.entityService.findEntityById(CatalogModel.entity, environment.catalogTransactionCategory)
      .subscribe(catalogModel => {
        this.catalogTransactionCategory = <CatalogModel>catalogModel; /*console.log(catalogModel);*/
      });

    //Account
    this.entityService.findEntityById(CatalogModel.entity, environment.catalogTransactionAccount)
      .subscribe(catalogModel => {
        this.catalogTransactionAccount = <CatalogModel>catalogModel; /*console.log(catalogModel);*/
      });

  }

  getTransactionItemName(catalogName: string, transaction: TransactionModel): String {
    let transactionItemName = "";
    let item: ItemModel;

    switch (catalogName) {
      case "type":
        if (typeof this.catalogTransactionType.list != "undefined") {
          item = this.catalogTransactionType.list.find(t => t._id == transaction.type);
        }
        break;
      case "category":
        if (typeof this.catalogTransactionCategory.list != "undefined") {
          item = this.catalogTransactionCategory.list.find(t => t._id == transaction.category);
        }
        break;
      case "account":
        if (typeof this.catalogTransactionAccount.list != "undefined") {
          item = this.catalogTransactionAccount.list.find(t => t._id == transaction.account);
        }
        break;
    }

    if (item) {
      transactionItemName = item.name;
    }
    return transactionItemName;
  }

  getStringFormat(string: string, limit: number): string {
    if (string.length >= limit) {
      return string.substring(0, limit) + "...";
    } else {
      return string;
    }
  }

  //************ EVENTS ************//
  @Output() eventCrud = new EventEmitter<any>();
  eventCrudEmitter(action: string, transaction: TransactionModel) {
    return this.eventCrud.emit({ action, transaction });
  }

}
