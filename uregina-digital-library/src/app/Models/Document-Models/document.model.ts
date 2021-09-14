import { Facet, AllFacets } from '..';

export class Doc {
    constructor(obj: Doc) {
        Object.assign(this, obj);
    }
    facets?: AllFacets;
    creationDate?: string;
    doi?: string;
    issn?: string;
    snippet?: string;
    identifier?: string;
    description?: string;
    source?: string;
    visFacets?: Facet[];
    title?: string;
    isFocused?= false;
    focusedFacetsCount?= 0;
    type?= '';
    rawObject?: any;
    page?: number;
    isSaved?= false;
    isRead?= false;
    id?: string;
    _id?: string;
    searchId?: string;
    sessionSeparator?: boolean = false;
    createdAt?: Date = null;
    sessionStartDate?: Date = null;
    sessionEndDate?: Date = null;
    imageUrl?: string = 'assets/images/book-placeholder.jpg';
    searchQuery?= '';
}