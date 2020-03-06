import { LogModel } from './log.model';

export class EntityModel {

    _id: string;
    creationDate: Date;
    state: string;

    //logs: LogModel[];

    constructor() {        
        //this.logs = [];
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

}
