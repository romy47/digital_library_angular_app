import { Facet, AllFacets } from '..';
import { Label } from './label.model';


export class Doc {
    constructor(obj: Doc) {
        Object.assign(this, obj);
    }
    linkText? = '';
    language? = '';
    publisher? = '';
    allIdentifiers? = [];
    peerReviewed? = false;
    openAccess? = false;
    facets?: AllFacets;
    creationDate?: string;
    doi?: string;
    issn?: string;
    snippet?: string;
    identifier?: string;
    description?: string;
    source?: string;
    secondarySource?: string;
    title?: string;
    isFocused? = false;
    type? = '';
    rawObject?: any;
    page?: number;
    isSaved? = false;
    selected? = false;
    labels?: Label[] = [];
    id?: string;
    _id?: string;
    createdAt?: Date = null;
    imageUrl?: string = 'assets/images/book-placeholder.jpg';
    createdBy? = '';
    static getInsertApiModel(doc: Doc): any {
        delete doc.isFocused;
        delete doc.selected;
        delete doc.imageUrl;
        delete doc.createdAt;
        delete doc.createdBy;
        delete doc._id;
        return doc;
    }
}
