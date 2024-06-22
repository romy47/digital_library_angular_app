import { Facet, AllFacets, Doc } from '..';
import { Search } from '../task-models/task.model';

export class Session {
    constructor(obj: Session) {
        Object.assign(this, obj);
    }
    queries: Search[];
    timeSpent: number;
    docSaved: number;
    isFocused?: boolean = false;
    queriesOpened?: boolean = true;
    id?: string = '';
}