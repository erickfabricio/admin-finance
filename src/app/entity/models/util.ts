import { RoleModel } from './role.model';
import { PrivilegeCollectionModel } from './privilege.collection.model';
import { EntityService } from '../services/entity.service';
import { CatalogModel } from './catalog.model';

export class Util {

    constructor(private entityService: EntityService){

    }

    public static validateAccessCollection(role: RoleModel, collection: string, action: string): boolean {
        let access: boolean = false;

        try {

            let pc: PrivilegeCollectionModel = role.privileges.collections.find(c => c.name == collection);

            switch (action) {
                case "create":
                    access = pc.create;
                    break;
                case "read":
                    access = pc.read;
                    break;
                case "update":
                    access = pc.update;
                    break;
                case "delete":
                    access = pc.delete;
                    break;
            }
        } catch (ex) {
            //console.log("Collection: " + collection + ", no definida");
            return access;
        }

        //console.log(access);
        return access;
    }


    public getCatalog(): CatalogModel {
        let catalog: CatalogModel;
        this.entityService.findEntityById("catalogs", "5e53efb6f718980f780b79b7")
            .subscribe(catalogModel => { console.log(catalogModel); catalog = <CatalogModel>catalogModel; });
        return catalog;
    }

    public static test(): string{
        return "Hola";
    }


}