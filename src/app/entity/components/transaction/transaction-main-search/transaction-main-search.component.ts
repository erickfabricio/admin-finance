import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UserModel } from 'src/app/entity/models/user.model';
import { PrivilegeCollectionModel } from 'src/app/entity/models/privilege.collection.model';
import { CatalogModel } from 'src/app/entity/models/catalog.model';
import { EntityService } from 'src/app/entity/services/entity.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionModel } from 'src/app/entity/models/transaction.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ItemModel } from 'src/app/entity/models/item.model';
import { environment } from 'src/environments/environment.prod';
import { FormControl } from '@angular/forms';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { Util } from 'src/app/entity/models/util';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'admin-entity-transaction-main-search',
  templateUrl: './transaction-main-search.component.html',
  styleUrls: ['./transaction-main-search.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class TransactionMainSearchComponent implements OnInit {

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

  //Filter
  filters: any[] = [];
  transactionsFilter: TransactionModel[] = [];

  today: Date;
  inputStartDate = new FormControl(moment());
  inputEndDate = new FormControl(moment());

  filterTransactionType: TransactionModel[];
  filterTransactionCategory: TransactionModel[];
  filterTransactionAccount: TransactionModel[];

  resumenTransactionType: any[] = [];
  resumenTransactionCategory: any[] = [];
  resumenTransactionAccount: any[] = [];

  //Session
  @Input('userSession') userSession: UserModel;
  @Input('privilegeCollectionSession') privilegeCollectionSession: PrivilegeCollectionModel;

  constructor(private entityService: EntityService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.displayedColumns = ['#', 'description', 'type', 'category', 'account', 'amount', 'date'];
    this.dataSource = new MatTableDataSource<TransactionModel>();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getCatalogs();
    this.today = new Date();
  }

  //************ CATALOGS ************//

  getCatalogs() {

    //Type
    this.entityService.findEntityById(CatalogModel.entity, environment.catalogTransactionType)
      .subscribe(catalogModel => {
        this.catalogTransactionType = <CatalogModel>catalogModel; /*console.log(catalogModel);*/
        //Order
        this.catalogTransactionType.list = <ItemModel[]>Util.orderAsc(this.catalogTransactionType.list, 'name');

        this.addFilter("type", this.catalogTransactionType);
      });

    //Category
    this.entityService.findEntityById(CatalogModel.entity, environment.catalogTransactionCategory)
      .subscribe(catalogModel => {
        this.catalogTransactionCategory = <CatalogModel>catalogModel; /*console.log(catalogModel);*/
        //Order
        this.catalogTransactionCategory.list = <ItemModel[]>Util.orderAsc(this.catalogTransactionCategory.list, 'name');
        this.addFilter("category", this.catalogTransactionCategory);
      });

    //Account
    this.entityService.findEntityById(CatalogModel.entity, environment.catalogTransactionAccount)
      .subscribe(catalogModel => {
        this.catalogTransactionAccount = <CatalogModel>catalogModel; /*console.log(catalogModel);*/
        //Order
        this.catalogTransactionAccount.list = <ItemModel[]>Util.orderAsc(this.catalogTransactionAccount.list, 'name');
        this.addFilter("account", this.catalogTransactionAccount);
      });

    //Transactions
    this.entityService.find(TransactionModel.entity)
      .subscribe(transactions => {
        this.transactions = <TransactionModel[]>transactions;
        //this.dataSource.data = this.transactions 
        this.applyFilter();
      });

  }

  getTransactionItemName(catalogName: string, transaction: TransactionModel): String {
    let transactionItemName = "";
    let item: ItemModel;

    switch (catalogName) {
      case "type":
        item = this.catalogTransactionType.list.find(t => t._id == transaction.type);
        break;
      case "category":
        item = this.catalogTransactionCategory.list.find(t => t._id == transaction.category);
        break;
      case "account":
        item = this.catalogTransactionAccount.list.find(t => t._id == transaction.account);
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

  //Filter  
  addFilter(filter: String, catalog: CatalogModel) {
    for (let item of catalog.list) {
      this.filters.push({ filter: filter, idItemList: item._id, selected: true, item: item });
    }
  }

  filterChange(item: ItemModel, selected: boolean) {
    this.filters.find(f => f.idItemList === item._id).selected = selected;
  }

  filterChangeGroup(group: String, selected: boolean) {
    console.log(group + ":" + selected);
    switch (group) {
      case "type":
        this.filters.find(f => f.filter === group).selected = selected;
        break;
    }
  }

  applyFilter() {

    let transactionsFound: TransactionModel[] = [];

    //Validacion de fechas
    if (moment(this.inputStartDate.value).format('DD-MM-YYYY') > moment(this.inputEndDate.value).format('DD-MM-YYYY')) {
      this.openSnackBar("¡La fecha inicial no puede ser mayor que la fecha final!", "X", "snackbar-danger");
      return;
    }

    //Validacion de filtros
    if (this.filters.filter(f => f.selected === true).length == 0) {
      transactionsFound = this.transactions.filter(t =>
        moment(t.date).format('DD-MM-YYYY') >= this.inputStartDate.value.format('DD-MM-YYYY')
        && moment(t.date).format('DD-MM-YYYY') <= this.inputEndDate.value.format('DD-MM-YYYY')
      );
    }

    //Resumen
    this.filterTransactionType = [];
    this.filterTransactionCategory = [];
    this.filterTransactionAccount = [];

    //Recorre los filtros seleccionados
    for (let item of this.filters) {

      if (item.selected) {

        switch (item.filter) {

          case 'type':
            let tsType: TransactionModel[] = this.transactions.filter(t => t.type === item.idItemList
              && moment(t.date).format('DD-MM-YYYY') >= this.inputStartDate.value.format('DD-MM-YYYY')
              && moment(t.date).format('DD-MM-YYYY') <= this.inputEndDate.value.format('DD-MM-YYYY')
            );

            for (let t of tsType) {
              if (transactionsFound.indexOf(t) == -1) {
                transactionsFound.push(t);
              }
              this.filterTransactionType.push(t);
            }

            break;

          case 'category':
            let tsCategory: TransactionModel[] = this.transactions.filter(t => t.category === item.idItemList
              && moment(t.date).format('DD-MM-YYYY') >= this.inputStartDate.value.format('DD-MM-YYYY')
              && moment(t.date).format('DD-MM-YYYY') <= this.inputEndDate.value.format('DD-MM-YYYY')
            );

            for (let t of tsCategory) {
              if (transactionsFound.indexOf(t) == -1) {
                transactionsFound.push(t);
              }
              this.filterTransactionCategory.push(t);
            }

            break;

          case 'account':
            let tsAccount: TransactionModel[] = this.transactions.filter(t => t.account === item.idItemList
              && moment(t.date).format('DD-MM-YYYY') >= this.inputStartDate.value.format('DD-MM-YYYY')
              && moment(t.date).format('DD-MM-YYYY') <= this.inputEndDate.value.format('DD-MM-YYYY')
            );

            for (let t of tsAccount) {
              if (transactionsFound.indexOf(t) == -1) {
                transactionsFound.push(t);
              }
              this.filterTransactionAccount.push(t);
            }

            break;

        }

      }
    }

    //Resumen
    this.getResumen(transactionsFound);
  }

  //Notification
  openSnackBar(message: string, action: string, style: string) {
    this._snackBar.open(
      message,
      action,
      {
        duration: 4000,
        verticalPosition: 'top',
        panelClass: [style]
      }
    );
  }

  //Resumen
  getResumen(transactionsFound: TransactionModel[]) {

    this.transactionsFilter = [];

    let filtersType: any[] = [];
    let filtersCategory: any[] = [];
    let filtersAccount: any[] = [];

    this.resumenTransactionType = [];
    this.resumenTransactionCategory = [];
    this.resumenTransactionAccount = [];

    filtersType = this.filters.filter(f => f.selected === true && f.filter === 'type');
    filtersCategory = this.filters.filter(f => f.selected === true && f.filter === 'category');
    filtersAccount = this.filters.filter(f => f.selected === true && f.filter === 'account');

    /*
    console.log(filtersType);
    console.log(filtersCategory);
    console.log(filtersAccount);*/

    //*********************** Filtro de transacciones ***********************//

    //#0

    if (filtersType.length === 0 && filtersCategory.length === 0 && filtersAccount.length === 0) {
      this.transactionsFilter = transactionsFound;
    }

    //#1

    //Solo type
    if (filtersType.length !== 0 && filtersCategory.length === 0 && filtersAccount.length === 0) {
      this.transactionsFilter = this.filterTransactionType;
    }

    //Solo category
    if (filtersType.length === 0 && filtersCategory.length !== 0 && filtersAccount.length === 0) {
      this.transactionsFilter = this.filterTransactionCategory;
    }

    //Solo account
    if (filtersType.length === 0 && filtersCategory.length === 0 && filtersAccount.length !== 0) {
      this.transactionsFilter = this.filterTransactionAccount;
    }

    //#2

    //Solo type y category
    if (filtersType.length !== 0 && filtersCategory.length !== 0 && filtersAccount.length === 0) {
      for (let transaction of transactionsFound) {
        if ((this.filterTransactionType.indexOf(transaction) != -1 && this.filterTransactionCategory.indexOf(transaction) != -1)) {
          this.transactionsFilter.push(transaction);
        }
      }
    }

    //Solo type y account
    if (filtersType.length !== 0 && filtersCategory.length === 0 && filtersAccount.length !== 0) {
      for (let transaction of transactionsFound) {
        if ((this.filterTransactionType.indexOf(transaction) != -1 && this.filterTransactionAccount.indexOf(transaction) != -1)) {
          this.transactionsFilter.push(transaction);
        }
      }
    }

    //Solo category y account
    if (filtersType.length === 0 && filtersCategory.length !== 0 && filtersAccount.length !== 0) {
      for (let transaction of transactionsFound) {
        if ((this.filterTransactionCategory.indexOf(transaction) != -1 && this.filterTransactionAccount.indexOf(transaction) != -1)) {
          this.transactionsFilter.push(transaction);
        }
      }
    }

    //#3

    //Los 3 -> type, category y account 
    if (filtersType.length !== 0 && filtersCategory.length !== 0 && filtersAccount.length !== 0) {
      for (let transaction of transactionsFound) {
        if ((this.filterTransactionType.indexOf(transaction) != -1 &&
          this.filterTransactionCategory.indexOf(transaction) != -1 &&
          this.filterTransactionAccount.indexOf(transaction) != -1)) {
          this.transactionsFilter.push(transaction);
        }
      }
    }

    //*********************** Resumen ***********************//

    //Resumen Agrupacion de tipos
    for (let type of filtersType) {
      let groupTransactionType = this.transactionsFilter.filter(t => t.type === type.item._id);
      let amountGroupTransactionType: number = 0;
      for (let transaction of groupTransactionType) {
        amountGroupTransactionType += transaction.amount;
      }
      //console.log(type.item.name + ": " + amountGroupTransactionType);            
      this.resumenTransactionType.push({ type: type.item.name, money: amountGroupTransactionType, count: groupTransactionType.length });
    }

    //Resumen Agrupacion de caregorias
    for (let category of filtersCategory) {
      let groupTransactionCategory = this.transactionsFilter.filter(t => t.category === category.item._id);
      let amountGroupTransactionCategory: number = 0;
      for (let transaction of groupTransactionCategory) {
        amountGroupTransactionCategory += transaction.amount;
      }
      //console.log(category.item.name + ": " + amountGroupTransactionCategory);
      this.resumenTransactionCategory.push({ category: category.item.name, money: amountGroupTransactionCategory, count: groupTransactionCategory.length });
    }

    //Resumen Agrupacion de cuentas
    for (let account of filtersAccount) {
      let groupTransactionAccount = this.transactionsFilter.filter(t => t.account === account.item._id);
      let amountGroupTransactionAccount: number = 0;
      for (let transaction of groupTransactionAccount) {
        amountGroupTransactionAccount += transaction.amount;
      }
      //console.log(account.item.name + ": " + amountGroupTransactionAccount);
      this.resumenTransactionAccount.push({ account: account.item.name, money: amountGroupTransactionAccount, count: groupTransactionAccount.length });
    }

    //*********************** Filtro de tabla ***********************//

    //console.log(transactionsFilter);
    this.transactionsFilter = Util.orderAsc(this.transactionsFilter, 'date'); //order
    this.dataSource.data = this.transactionsFilter;

  }

}
