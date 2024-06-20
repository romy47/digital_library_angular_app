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
    labels?: string[] = [];
    labelsPopulated: Label[] = [];
    id?: string;
    _id: string = null;
    __v?: number = 0;
    createdAt?: Date = null;
    updatedAt?: Date = null;
    imageUrl?: string = 'assets/images/book-placeholder.jpg';
    createdBy? = null;
    static getInsertApiModel(doc: Doc): any {
        let output = new Doc(doc);
        delete output._id;
        delete output.isFocused;
        delete output.selected;
        delete output.imageUrl;
        delete output.createdAt;
        delete output.updatedAt;
        delete output.createdBy;
        output.labels = output.labelsPopulated ? output.labelsPopulated.map(l => l._id) : []
        delete output.labelsPopulated;
        delete output.__v;
        return output;
    }

    static getUpdateApiModel(doc: Doc): any {
        console.log('OP -1 ', doc)

        let output = new Doc(doc);
        let labels = [];
        console.log('OP ', output)
        output.labelsPopulated.forEach(l => {
            if (l._id) {
                labels.push(l._id)
            }
        });
        if (output._id == null) {
            delete output._id;
        }
        delete output.isFocused;
        delete output.selected;
        delete output.imageUrl;
        delete output.createdAt;
        delete output.updatedAt;
        delete output.labelsPopulated;
        delete output.__v;
        output.labels = labels;
        return output;
    }
}
