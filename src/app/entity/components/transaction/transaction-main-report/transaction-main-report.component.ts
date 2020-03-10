import { Component, OnInit, Input } from '@angular/core';
import { UserModel } from 'src/app/entity/models/user.model';
import { PrivilegeCollectionModel } from 'src/app/entity/models/privilege.collection.model';
import { environment } from 'src/environments/environment.prod';
import { FormControl } from '@angular/forms';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { Util } from 'src/app/entity/models/util';
import { TransactionModel } from 'src/app/entity/models/transaction.model';
import { CatalogModel } from 'src/app/entity/models/catalog.model';
import { EntityService } from 'src/app/entity/services/entity.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemModel } from 'src/app/entity/models/item.model';

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
  selector: 'admin-entity-transaction-main-report',
  templateUrl: './transaction-main-report.component.html',
  styleUrls: ['./transaction-main-report.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class TransactionMainReportComponent implements OnInit {

  //Session
  @Input('userSession') userSession: UserModel;
  @Input('privilegeCollectionSession') privilegeCollectionSession: PrivilegeCollectionModel;

  //List
  transactions: TransactionModel[];

  //Catalogs
  catalogTransactionType: CatalogModel = new CatalogModel();
  catalogTransactionCategory: CatalogModel = new CatalogModel();
  catalogTransactionAccount: CatalogModel = new CatalogModel();

  today: Date;
  historicalDate = moment(environment.historicalDate, 'DD-MM-YYYY').toDate();
  inputStartDate = new FormControl(moment(environment.startDate, 'DD-MM-YYYY').toDate());

  ingreso: number;
  egreso: number;
  diferencia: number;

  constructor(private entityService: EntityService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getCatalogs();
    this.today = new Date();
  }

  //************ CATALOGS ************//

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

    //Transactions
    this.entityService.find(TransactionModel.entity)
      .subscribe(transactions => {
        this.transactions = <TransactionModel[]>transactions;
        this.applyFilter();
      });

  }

  applyFilter() {
    
    //Ingreso
    let groupTransactionIngreso = this.transactions.filter(t => t.type === environment.catalogTransactionTypeIngreso &&
      moment(t.date).format('DD-MM-YYYY') >= moment(this.inputStartDate.value).format('DD-MM-YYYY'));

    this.ingreso = 0;
    for (let t of groupTransactionIngreso) {
      this.ingreso += t.amount;
    }

    //Egreso
    let groupTransactionEgreso = this.transactions.filter(t => t.type === environment.catalogTransactionTypeEgreso &&
      moment(t.date).format('DD-MM-YYYY') >= moment(this.inputStartDate.value).format('DD-MM-YYYY'));

    this.egreso = 0;
    for (let t of groupTransactionEgreso) {
      this.egreso += t.amount;
    }
    
    //Diferencia
    this.diferencia = this.ingreso - this.egreso;

  }

}
