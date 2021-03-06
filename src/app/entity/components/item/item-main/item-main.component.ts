import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ItemListComponent } from '../item-list/item-list.component';
import { ItemCrudComponent } from '../item-crud/item-crud.component';
import { CatalogModel } from 'src/app/entity/models/catalog.model';

@Component({
  selector: 'admin-entity-item-main',
  templateUrl: './item-main.component.html',
  styleUrls: ['./item-main.component.css']
})
export class ItemMainComponent implements OnInit, OnChanges {
  

  @ViewChild("tabGroup", { static: true }) tabGroup;
  @ViewChild("tabList", { static: true }) tabList;
  @ViewChild("list", { static: true }) list: ItemListComponent;
  @ViewChild("tabCrud", { static: true }) tabCrud;
  @ViewChild("crud", { static: true }) crud: ItemCrudComponent;
  view: string;

  @Input('catalog') catalog: CatalogModel;
  //catalog: CatalogModel;
  
  constructor() { }

  ngOnInit() {    
    this.view = "LIST";    
    this.captureEventList();
    this.captureEventCrud();    
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    //console.log("ItemMain-ngOnChanges");
    //console.log(this.catalog);
    this.list.catalog = this.catalog;
    this.list.find(this.catalog);
  }

  captureEventList() {
    this.list.eventCrud.pipe().subscribe(data => {
      //Data      
      //console.item(data.action);
      //console.item(data.item);

      //Send data to CRUD
      this.crud.action = data.action;
      this.crud.item = data.item;
      this.crud.catalog = this.catalog;              
      this.crud.show();

      //Change and enable tag      
      if(data.action != "CREATE"){
        this.tabCrud.textLabel = data.item.name;
      }else{
        this.tabCrud.textLabel = "Nuevo item";
      }
      this.tabCrud.disabled = false;
      this.tabGroup.selectedIndex = 1;

      //Show mat-tab-header
      this.view = "CRUD";

    });
  }

  captureEventCrud() {
    this.crud.eventUpdateList.pipe().subscribe(data => {
      //Data      
      console.log(data);
      
      if (data.isUpdate) {        
        this.catalog = data.catalog;
        this.list.catalog = this.catalog;
        this.list.find(this.catalog);
      };

      if (this.crud.action == "DELETE") {        
        this.tabGroup.selectedIndex = 0;
      }
      
    });    
  }

  onChangeTab(event: MatTabChangeEvent) {
    //console.item("Tag change:" + event.tab.textLabel);
    if (this.tabGroup.selectedIndex == 0) {
      this.tabCrud.textLabel = "";
      this.tabCrud.disabled = true;
      this.view = "LIST";
    }
  }  

}
