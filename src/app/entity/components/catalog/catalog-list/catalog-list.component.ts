import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EntityService } from 'src/app/entity/services/entity.service';
import { CatalogModel } from 'src/app/entity/models/catalog.model';
import { UserModel } from 'src/app/entity/models/user.model';
import { PrivilegeCollectionModel } from 'src/app/entity/models/privilege.collection.model';
import { Util } from 'src/app/entity/models/util';

@Component({
  selector: 'admin-entity-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.css']
})
export class CatalogListComponent implements OnInit {

  //Filter
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[];
  dataSource: MatTableDataSource<CatalogModel>;

  //List
  catalogs: CatalogModel[];

  //Session
  @Input('userSession') userSession: UserModel;
  @Input('privilegeCollectionSession') privilegeCollectionSession: PrivilegeCollectionModel;

  constructor(private entityService: EntityService) {    
  }

  ngOnInit() {
    this.displayedColumns = ['#', 'id', 'name', 'description', 'creation', 'state'];
    this.dataSource = new MatTableDataSource<CatalogModel>();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.find();
  }

  find() {
    this.entityService.find(CatalogModel.entity)
      .subscribe(catalogs => { 
        this.catalogs = <CatalogModel[]>catalogs; 
        //Order
        this.catalogs = Util.orderAsc(this.catalogs, 'name');
        this.dataSource.data = this.catalogs });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //************ EVENTS ************//
  @Output() eventCrud = new EventEmitter<any>();
  eventCrudEmitter(action: string, catalog: CatalogModel) {
    return this.eventCrud.emit({ action, catalog });
  }

}
