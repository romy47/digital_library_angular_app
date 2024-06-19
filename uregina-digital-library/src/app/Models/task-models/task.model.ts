import { Facet, AllFacets, Doc } from '..';
import { Session } from '../Session-Models/session.model';

export class Task {
    constructor(obj: Task) {
        Object.assign(this, obj);
    }
    createdAt?: Date;
    createdBy?: string;
    name?: string;
    sessions?: Session[] = [];
    searches?: Search[] = [];
    updatedAt?: Date;
    documentsSaved?: number = 0;
    __v?: number;
    _id?: string;
}

export class Search {
    constructor(obj: Search) {
        Object.assign(this, obj);
    }
    isSaved?: boolean = false;
    activePagefacetTab?: string;
    selected?: boolean = false;
    createdAt?: Date;
    documentsBrowsed?: number;
    interestedDocuments?: Doc[] = [];
    documentSaved?: number = 0;
    searchQuery?: string;
    selectedNavigationFacets?: AllFacets;
    taskId?: string;
    totalDocuments?: number;
    updatedAt?: Date;
    _id?: string;
    __v?: number;

    static getUpdateApiModel(search: Search): any {
        let output = new Search(search);
        delete output.selected;
        delete output.isSaved;
        delete output.interestedDocuments;
        delete output.documentSaved;
        delete output.createdAt;
        delete output.updatedAt;
        delete output.__v;
        return output;
    }
}
