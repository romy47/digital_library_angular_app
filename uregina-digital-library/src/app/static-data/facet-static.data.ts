export const FacetTypesForDropdown: {[key: string]: string} = {
    Subject: 'topics',
    Contributor: 'contributors',
    Journal: 'journalTitles',
    Type: 'resourceTypes',
};

export const FacetTypesForApiAndModelRelation: {[key: string]: string} = {
    contributors: 'creator',
    topics: 'topic',
    categories: 'tlevel',
    resourceTypes: 'rtype',
    journalTitles: 'jtitle',
    languages: 'lang',
    creationDate: 'searchcreationdate'
};

// facet_searchcreationdate,include,[1991 TO 2019]|,|