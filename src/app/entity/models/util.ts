import { RoleModel } from './role.model';
import { PrivilegeCollectionModel } from './privilege.collection.model';
import { EntityService } from '../services/entity.service';
import { CatalogModel } from './catalog.model';

export class Util {

    constructor(private entityService: EntityService) {

    }

    public static orderAsc(array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    public static orderDesc(array, key) {
        this.orderAsc(array, key);
        return array.reverse();
    }

}