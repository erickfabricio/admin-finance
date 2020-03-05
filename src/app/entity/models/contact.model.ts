import { EntityModel } from './entity.model';
import { ItemModel } from './item.model';

export class ContactModel extends EntityModel {

    //static entity: string = "catalogs";

    name: string;
    description: string;
    mail: string;
    cellPhone: string;
    officePhone: string;
  
}