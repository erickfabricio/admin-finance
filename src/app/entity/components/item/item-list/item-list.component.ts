import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EntityService } from 'src/app/entity/services/entity.service';
import { ItemModel } from 'src/app/entity/models/item.model';
import { CatalogModel } from 'src/app/entity/models/catalog.model';
import { Util } from 'src/app/entity/models/util';

@Component({
  selector: 'admin-entity-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  
  //Filter
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[];
  dataSource: MatTableDataSource<ItemModel>;

  catalog: CatalogModel;
            
  constructor(private entityService: EntityService) { }

  ngOnInit() {
    this.displayedColumns = ['#', 'name', 'description'];
  }

  find(catalog: CatalogModel) {
    //Init
    this.dataSource = new MatTableDataSource<ItemModel>();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.catalog = catalog;
    //Oreder
    this.catalog.list = Util.orderAsc(this.catalog.list, 'name');
    this.dataSource.data = this.catalog.list;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //************ EVENTS ************//
  @Output() eventCrud = new EventEmitter<any>();
  eventCrudEmitter(action: string, item: ItemModel) {    
    return this.eventCrud.emit({action, item, catalog: this.catalog});
  }

}
