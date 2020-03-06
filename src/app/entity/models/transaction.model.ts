import { EntityModel } from './entity.model';

export class TransactionModel extends EntityModel {

    static entity: string = "transactions";
                 
    type: string; //Item list
    category: string; //Item list
    account: string; //Item list
    description: string;
    amount: number;
    date: Date;
    commentary: string;

}
