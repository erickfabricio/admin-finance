import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EntityService } from 'src/app/entity/services/entity.service';
import { TransactionModel } from 'src/app/entity/models/transaction.model';
import { UserModel } from 'src/app/entity/models/user.model';
import { PrivilegeCollectionModel } from 'src/app/entity/models/privilege.collection.model';
import { CatalogModel } from 'src/app/entity/models/catalog.model';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment.prod';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import * as _rollupMoment from 'moment';
import { ItemModel } from 'src/app/entity/models/item.model';
import { Util } from 'src/app/entity/models/util';
import { EntityModel } from 'src/app/entity/models/entity.model';
import { LogModel } from 'src/app/entity/models/log.model';

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
  selector: 'admin-entity-transaction-crud',
  templateUrl: './transaction-crud.component.html',
  styleUrls: ['./transaction-crud.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class TransactionCrudComponent implements OnInit {

  //CRUD
  action: string;
  transaction: TransactionModel;

  //Form
  title: string;
  form: FormGroup;
  visibleControls;

  //Catalogs
  catalogTransactionType: CatalogModel = new CatalogModel();
  catalogTransactionCategory: CatalogModel = new CatalogModel();
  catalogTransactionAccount: CatalogModel = new CatalogModel();

  //Session
  @Input('userSession') userSession: UserModel;
  @Input('privilegeCollectionSession') privilegeCollectionSession: PrivilegeCollectionModel;

  today: Date;

  constructor(private entityService: EntityService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.title = "CRUD";
    this.visibleControls = {
      id: true,
      type: true,
      category: true,
      account: true,
      description: true,
      amount: true,
      date: true,
      commentary: true,
      state: true,
      creationDate: true
    }
    this.createForm();

    //Catalogs    
    this.getCatalogs();

    this.today = new Date();
  }

  createForm() {
    this.form = new FormGroup({
      id: new FormControl({ value: '', disabled: true }),
      type: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      account: new FormControl('', [Validators.required]),

      description: new FormControl('', [Validators.required, Validators.minLength(5)]),
      amount: new FormControl('', [Validators.required]),
      date: new FormControl(moment(), [Validators.required]),
      commentary: new FormControl(''),

      state: new FormControl('', [Validators.required]),
      creationDate: new FormControl({ value: '', disabled: true })
    });
  }

  show() {
    //Action
    switch (this.action) {
      case "CREATE":
        this.create();
        break;
      case "CRUD":
        this.crud();
        break;
    }
  }

  //************ CATALOGS ************//

  public getCatalogs() {

    //Type
    this.entityService.findEntityById(CatalogModel.entity, environment.catalogTransactionType)
      .subscribe(catalogModel => {
        this.catalogTransactionType = <CatalogModel>catalogModel; /*console.log(catalogModel);*/
        //Order
        this.catalogTransactionType.list = <ItemModel[]>Util.orderAsc(this.catalogTransactionType.list, 'name');
      });

    //Category
    this.entityService.findEntityById(CatalogModel.entity, environment.catalogTransactionCategory)
      .subscribe(catalogModel => {
        this.catalogTransactionCategory = <CatalogModel>catalogModel; /*console.log(catalogModel);*/
        //Order
        this.catalogTransactionCategory.list = <ItemModel[]>Util.orderAsc(this.catalogTransactionCategory.list, 'name');
      });

    //Account
    this.entityService.findEntityById(CatalogModel.entity, environment.catalogTransactionAccount)
      .subscribe(catalogModel => {
        this.catalogTransactionAccount = <CatalogModel>catalogModel; /*console.log(catalogModel);*/
        //Order
        this.catalogTransactionAccount.list = <ItemModel[]>Util.orderAsc(this.catalogTransactionAccount.list, 'name');
      });

  }

  //************ FORM ************//

  create() {
    this.title = "Nueva transacción";
    this.visibleControls.id = false;
    this.visibleControls.creationDate = false;
    this.form.reset();
    this.transaction = null;

    this.form.get('date').setValue(moment());
  }

  crud() {
    this.title = "Transacción";

    this.form.get('id').setValue(this.transaction._id);
    this.form.get('type').setValue(this.transaction.type);
    this.form.get('category').setValue(this.transaction.category);
    this.form.get('account').setValue(this.transaction.account);
    this.form.get('description').setValue(this.transaction.description);
    this.form.get('amount').setValue(this.transaction.amount);
    this.form.get('date').setValue(this.transaction.date);
    this.form.get('commentary').setValue(this.transaction.commentary);

    this.form.get('state').setValue(this.transaction.state);
    this.form.get('creationDate').setValue(formatDate(this.transaction.creationDate, 'MMM d, y, h:mm:ss a', 'en-US'));

    
    this.visibleControls = {
      id: true,
      type: true,
      category: true,
      account: true,
      description: true,
      amount: true,
      date: true,
      commentary: true,
      state: true,
      creationDate: true
    }
  }

  //************ ACTIONS OF FORM ************//

  onCreate() {
    if (this.form.valid) {

      //Assignment of values

      //Entity
      this.transaction = new TransactionModel();
      this.transaction.type = String(this.form.get('type').value).trim();
      this.transaction.category = String(this.form.get('category').value).trim();
      this.transaction.account = String(this.form.get('account').value).trim();
      this.transaction.description = String(this.form.get('description').value).trim();
      this.transaction.amount = this.form.get('amount').value;
      this.transaction.date = this.form.get('date').value;
      this.transaction.commentary = String(this.form.get('commentary').value).trim();
      this.transaction.state = String(this.form.get('state').value).trim();

      /*
      //Log
      let log: LogModel = new LogModel();
      log.user = this.userSession._id;
      log.action = "CREATE";
      log.description = "Nueva transacción";
      log.entity = JSON.stringify(this.transaction);
      this.transaction.logs.push(log);
      */


      //Api 
      this.entityService.save(TransactionModel.entity, this.transaction)
        .subscribe(transaction => {
          /*console.log("New transaction");*/
          this.transaction = <TransactionModel>transaction;
          this.eventUpdateListEmitter(true);

          //Succes
          let succesMessage = "Nueva transacción: " + this.transaction._id;
          this.openSnackBar(succesMessage, "X", "snackbar-success");
          this.createForm();
        });


    } else {
      //Error
      let errorMessage = "¡Formulario inválido, " + this.validateForm() + "!";
      this.openSnackBar(errorMessage, "X", "snackbar-danger");
    }
  }

  onUpdate() {
    //Check if there were changes    
    if (this.form.valid) {
      
      //Assignment of values 

      //Entity
      this.transaction.type = String(this.form.get('type').value).trim();
      this.transaction.category = String(this.form.get('category').value).trim();
      this.transaction.account = String(this.form.get('account').value).trim();
      this.transaction.description = String(this.form.get('description').value).trim();
      this.transaction.amount = this.form.get('amount').value;
      this.transaction.date = this.form.get('date').value;
      this.transaction.commentary = String(this.form.get('commentary').value).trim();
      this.transaction.state = String(this.form.get('state').value).trim();

      /*
      //Log
      let log: LogModel = new LogModel();
      log.user = this.userSession._id;
      log.action = "Update";
      log.description = "Actualización de transacción";
      log.entity = JSON.stringify(this.transaction);
      this.transaction.logs.push(log);
      */

      //Api 
      this.entityService.update(TransactionModel.entity, this.transaction)
        .subscribe(transaction => { /*console.log("Update transaction");*/ this.transaction = <TransactionModel>transaction });

      //Succes
      let succesMessage = "Se actualizó transacción: " + this.transaction._id;
      this.openSnackBar(succesMessage, "X", "snackbar-success");
    } else {
      //Error
      let errorMessage = "¡Formulario inválido, " + this.validateForm() + "!";
      this.openSnackBar(errorMessage, "X", "snackbar-danger");
    }
  }

  onDelete() {
    this.action = "DELETE";
    //Api
    this.entityService.remove(TransactionModel.entity, this.transaction)
      .subscribe(transaction => { this.transaction = <TransactionModel>transaction; /*console.log("Delete transaction"); console.log(this.transaction);*/ this.eventUpdateListEmitter(true) });
    //Succes
    let succesMessage = "Se eliminó transacción: " + this.transaction._id;
    this.openSnackBar(succesMessage, "X", "snackbar-success");
  }

  //************ FORM VIDATION ************//

  validateForm() {
    if (this.form.get('type').invalid) {
      return this.getErrorMessageType();
    }

    if (this.form.get('category').invalid) {
      return this.getErrorMessageCategory();
    }

    if (this.form.get('account').invalid) {
      return this.getErrorMessageAccount();
    }

    if (this.form.get('description').invalid) {
      return this.getErrorMessageDescription();
    }

    if (this.form.get('amount').invalid) {
      return this.getErrorMessageAmount();
    }

    if (this.form.get('date').invalid) {
      return this.getErrorMessageDate();
    }

    if (this.form.get('state').invalid) {
      return this.getErrorMessageState();
    }
  }

  getErrorMessageType() {
    if (this.form.get('type').hasError('required')) {
      return `El campo 'tipo' es requerido`;
    }
  }

  getErrorMessageCategory() {
    if (this.form.get('category').hasError('required')) {
      return `El campo 'categoría' es requerido`;
    }
  }

  getErrorMessageAccount() {
    if (this.form.get('account').hasError('required')) {
      return `El campo 'cuenta' es requerido`;
    }
  }

  getErrorMessageDescription() {
    if (this.form.get('description').hasError('required')) {
      return 'La descripción es requerida';
    }
    if (this.form.get('description').hasError('minlength')) {
      return `La descripción debe de contener al menos ${this.form.get('description').errors.minlength.requiredLength} caracteres`;
    }
  }

  getErrorMessageAmount() {
    if (this.form.get('amount').hasError('required')) {
      return `El monto es requerido`;
    }
  }

  getErrorMessageDate() {
    if (this.form.get('date').hasError('required')) {
      return `El fecha es requerida`;
    }
  }

  getErrorMessageCommentary() {

  }

  getErrorMessageState() {
    if (this.form.get('state').hasError('required')) {
      return 'El estado es requerido';
    }
  }

  openSnackBar(message: string, action: string, style: string) {
    this._snackBar.open(
      message,
      action,
      {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: [style]
      }
    );
  }

  //************ EVENTS ************//
  //Process
  @Output() eventUpdateList = new EventEmitter<boolean>();
  eventUpdateListEmitter(isUpdate: boolean) {
    if (isUpdate) {
      this.eventUpdateList.emit(isUpdate);
    }
  }

}
