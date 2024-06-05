export class Facet {
    constructor(obj: Facet) {
        Object.assign(this, obj);
    }
    text? = '';
    count? = 1;
}

export class AllFacets {
    contributors?: Facet[];
    topics?: Facet[];
    categories?: Facet[];
    resourceTypes?: Facet[];
    journalTitles?: Facet[];
    languages?: Facet[];
    creationDate?: Facet[];

    constructor(obj?: AllFacets) {
        Object.assign(this, obj);
    }
}

export class Colour {
    constructor(obj: Colour = {}) {
        Object.assign(this, obj);
    }
    value? = '#dedede';
    isSelected? = false;
}

export class PopupMenu {

}
