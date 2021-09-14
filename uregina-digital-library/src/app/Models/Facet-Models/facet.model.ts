export class Facet {
    constructor(obj: Facet) {
        Object.assign(this, obj);
    }
    text ?= 'undefined';
    count ?= 1;
    selectLevel ?= 0;
    isSelected ?= false;
    colour?: Colour = {value: '#8dd3c7'};
    order ?= 0;
    hasPopup ?= false;
    type ?: string;
}

export class AllFacets {
    contributors?: Facet[];
    topics?: Facet[];
    categories?: Facet[];
    resourceTypes?: Facet[];
    journalTitles?: Facet[];
    languages?: Facet[];
    creationDate?: Facet[];

    constructor(obj ?: AllFacets) {
        Object.assign(this, obj);
    }
}

export class Colour {
    constructor(obj: Colour = {}) {
        Object.assign(this, obj);
    }
    value ?= '#dedede';
    isSelected ?= false;
}

export class PopupMenu {

}
