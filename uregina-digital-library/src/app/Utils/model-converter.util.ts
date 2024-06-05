import { Facet, Colour, Doc, AllFacets } from 'src/app/Models/index';
import { ColourUtil } from './Colour.util';
import { FacetTypesForDropdown, FacetTypesForApiAndModelRelation } from '../static-data';
declare var require: any;

export class DocumentModelConverter {
    public static buildMultiFacetSearchParamFromFacets(selectedFacets: AllFacets): string {
        let query = '';
        const allFacetArr: Facet[] = [];

        allFacetArr.push(...selectedFacets.categories);
        allFacetArr.push(...selectedFacets.contributors);
        allFacetArr.push(...selectedFacets.journalTitles);
        allFacetArr.push(...selectedFacets.languages);
        allFacetArr.push(...selectedFacets.resourceTypes);
        allFacetArr.push(...selectedFacets.topics);

        if (selectedFacets.creationDate && selectedFacets.creationDate.length > 0) {
            let rangeStr = selectedFacets.creationDate[0].text.replace(':', 'TO');
            rangeStr = '%5B' + rangeStr + '%5D';
            allFacetArr.push({
                text: rangeStr,
            });
        }


        // const selectedFacetCount = allFacetArr.length;

        // for (let i = 0; i < selectedFacetCount; i++) {
        //     if (i === 0) {
        //         query += 'facet_' + FacetTypesForApiAndModelRelation[allFacetArr[i].type] + ',include,' + allFacetArr[i].text;
        //     } else {
        //         query += '|,|facet_' + FacetTypesForApiAndModelRelation[allFacetArr[i].type] + ',include,' + allFacetArr[i].text;
        //     }
        // }
        return query;
    }

    public static formatDocumentModels(docApiResponse: any[]): Doc[] {
        let docs: Doc[] = [];
        docApiResponse.forEach(d => {
            const doc = this.formatSingleDocumentModel(d);
            docs.push(doc);
        });
        return docs;
    }

    public static formatSingleDocumentModel(d: any): Doc {
        let langs = require('langs');

        // console.log(d);
        let imageSrc;
        let desc = '';
        if (d.pnx.display.description && d.pnx.display.description[0]) {
            d.pnx.display.description.forEach(element => {
                if (element && element.length > 20) {
                    desc += element;
                    desc += '</br>';
                }
            });
        }
        // console.log('VVVVVVVVVVVVVVVV   ', desc);
        return new Doc({
            id: d['@id'],
            _id: d._id ? d._id : '',
            createdAt: d.createdAt ? d.createdAt : '',
            title: d.pnx.display.title[0],
            type: (d.pnx.display.type && d.pnx.display.type[0]) ? d.pnx.display.type[0] : '',
            doi: (d.pnx.addata && d.pnx.addata.doi && d.pnx.addata.doi[0]) ? d.pnx.addata.doi[0] : '',
            issn: (d.pnx.addata && d.pnx.addata.issn && d.pnx.addata.issn[0]) ? d.pnx.addata.issn[0].replace(/-/g, "") : '',
            creationDate: (d.pnx.facets.creationdate && d.pnx.facets.creationdate[0]) ? d.pnx.facets.creationdate[0] : '',
            source: (d.pnx.display.ispartof && d.pnx.display.ispartof[0]) ? d.pnx.display.ispartof[0] : '',
            secondarySource: (d.pnx.display.source && d.pnx.display.source[0]) ? d.pnx.display.source[0] : '',
            snippet: (d.pnx.display.snippet && d.pnx.display.snippet[0]) ? d.pnx.display.snippet[0] : '',
            identifier: (d.pnx.display.identifier && d.pnx.display.identifier[0]) ? d.pnx.display.identifier[0] : '',
            allIdentifiers: (d.pnx.display.identifier) ? d.pnx.display.identifier : [],
            description: desc,
            imageUrl: imageSrc ? imageSrc : 'assets/images/book-placeholder.jpg',
            facets: {
                topics: this.getTopicFacets(d),
                contributors: this.getContributorFacets(d),
                journalTitles: this.getJournalTitleFacets(d),
                resourceTypes: this.getResourceTypeFacets(d)
            },
            rawObject: d,
            peerReviewed: (d.pnx.display.lds50 && d.pnx.display.lds50[0] && d.pnx.display.lds50[0] == "peer_reviewed") ? true : false,
            openAccess: (d.pnx.display.oa && d.pnx.display.oa[0] && d.pnx.display.oa[0] == "free_for_read") ? true : false,
            linkText: (d.delivery && d.delivery.availability && d.delivery.availability[0]) ? d.delivery.availability[0] : '',
            createdBy: d.createdBy ? d.createdBy : '',
            language: (d.pnx.display.language && d.pnx.display.language[0]) ? langs.where("2", d.pnx.display.language[0]) ? langs.where("2", d.pnx.display.language[0]).name : '' : '',
            publisher: (d.pnx.addata && d.pnx.addata.cop && d.pnx.addata.cop.length > 0) && (d.pnx.addata && d.pnx.addata.pub && d.pnx.addata.pub.length > 0) ?
                d.pnx.addata.cop[0] + ' : ' + d.pnx.addata.pub[0] : '',
            labels: d.labels ? d.labels : []
        });
    }

    public static getNavigationFacetsFromDocuments(apiResponse: any): AllFacets {
        const distinctColours: Colour[] = ColourUtil.getDistinctColors(10);
        // tslint:disable-next-line:max-line-length
        const allFacets: AllFacets = new AllFacets({ topics: [], contributors: [], categories: [], resourceTypes: [], journalTitles: [], languages: [], creationDate: [] });
        if (apiResponse.facets.find(af => af.name === 'creator')) {
            apiResponse.facets.find(af => af.name === 'creator').values.forEach(f => {
                allFacets.contributors.push(new Facet({
                    text: f.value,
                    count: f.count,
                }));
            });
            allFacets.contributors.sort((a, b) => (a.count < b.count) ? 1 : -1);
        }

        if (apiResponse.facets.find(af => af.name === 'topic')) {
            apiResponse.facets.find(af => af.name === 'topic').values.forEach(f => {
                allFacets.topics.push(new Facet({
                    text: f.value,
                    count: f.count,
                }));
            });
            allFacets.topics.sort((a, b) => (a.count < b.count) ? 1 : -1);
        }

        if (apiResponse.facets.find(af => af.name === 'tlevel')) {
            apiResponse.facets.find(af => af.name === 'tlevel').values.forEach(f => {
                allFacets.categories.push(new Facet({
                    text: f.value,
                    count: f.count,
                }));
            });
            allFacets.categories.sort((a, b) => (a.count < b.count) ? 1 : -1);
        }


        if (apiResponse.facets.find(af => af.name === 'rtype')) {
            apiResponse.facets.find(af => af.name === 'rtype').values.forEach(f => {
                allFacets.resourceTypes.push(new Facet({
                    text: f.value,
                    count: f.count
                }));
            });
            allFacets.resourceTypes.sort((a, b) => (a.count < b.count) ? 1 : -1);
        }

        if (apiResponse.facets.find(af => af.name === 'jtitle')) {
            apiResponse.facets.find(af => af.name === 'jtitle').values.forEach(f => {
                allFacets.journalTitles.push(new Facet({
                    text: f.value,
                    count: f.count
                }));
            });
            allFacets.journalTitles.sort((a, b) => (a.count < b.count) ? 1 : -1);
        }

        if (apiResponse.facets.find(af => af.name === 'lang')) {
            apiResponse.facets.find(af => af.name === 'lang').values.forEach(f => {
                allFacets.languages.push(new Facet({
                    text: f.value,
                    count: f.count
                }));
            });
            allFacets.languages.sort((a, b) => (a.count < b.count) ? 1 : -1);
        }
        allFacets.creationDate.push(new Facet({
            count: 1,
            text: '1900 : 2021'
        }));
        return allFacets;
    }

    public static getAllFacetsFromDocuments(docs: Doc[], type: string): Facet[] {
        const facets: Facet[] = [];
        switch (type.toLowerCase()) {
            case 'subject' || 'topic':
                docs.forEach(d => {
                    if (d.facets.topics && d.facets.topics.length > 0) {
                        d.facets.topics.forEach(f => {
                            const indx = facets.findIndex(tf => tf.text === f.text);
                            if (indx >= 0) {
                                facets[indx].count++;
                            } else {
                                facets.push(new Facet({
                                    text: f.text,
                                    count: 1
                                }));
                            }
                        });
                    }
                });
                break;
            case 'contributor' || 'author':
                docs.forEach(d => {
                    if (d.facets.contributors && d.facets.contributors.length > 0) {
                        d.facets.contributors.forEach(f => {
                            const indx = facets.findIndex(tf => tf.text === f.text);
                            if (indx >= 0) {
                                facets[indx].count++;
                            } else {
                                facets.push(new Facet({
                                    text: f.text
                                }));
                            }
                        });
                    }
                });
                break;
            case 'journal':
                docs.forEach(d => {
                    if (d.facets.journalTitles && d.facets.journalTitles.length > 0) {
                        d.facets.journalTitles.forEach(f => {
                            const indx = facets.findIndex(tf => tf.text === f.text);
                            if (indx >= 0) {
                                facets[indx].count++;
                            } else {
                                facets.push(new Facet({
                                    text: f.text
                                }));
                            }
                        });
                    }
                });
                break;
            case 'type':
                docs.forEach(d => {
                    if (d.facets.resourceTypes && d.facets.resourceTypes.length > 0) {
                        d.facets.resourceTypes.forEach(f => {
                            const indx = facets.findIndex(tf => tf.text === f.text);
                            if (indx >= 0) {
                                facets[indx].count++;
                            } else {
                                facets.push(new Facet({
                                    text: f.text
                                }));
                            }
                        });
                    }
                });
                break;
            default:
                break;
        }
        return facets;
    }

    // Depricated_Function
    public static getAllFacetsFromSearchResponse(docApiResponse: any[], allFacets?: AllFacets): AllFacets {
        if (!allFacets) {
            allFacets = new AllFacets({
                contributors: [],
                topics: []
            });
        }

        docApiResponse.forEach(d => {
            if (d.pnx.facets.topic && d.pnx.facets.topic.length > 0) {
                d.pnx.facets.topic.forEach(f => {
                    const indx = allFacets.topics.findIndex(tf => tf.text === f);
                    if (indx >= 0) {
                        allFacets.topics[indx].count++;
                    } else {
                        allFacets.topics.push(new Facet({
                            text: f.toString()
                        }));
                    }
                });
            }
            allFacets.topics.sort((a, b) => (a.count < b.count) ? 1 : -1);

            if (d.pnx.addata.aufirst && d.pnx.addata.aufirst.length > 0) {
                d.pnx.addata.aufirst.forEach((f, index) => {
                    const auText = (f ? f : '') + ' ' + (d.pnx.addata.aulast[index] ? d.pnx.addata.aulast[index] : '');
                    const indx = allFacets.contributors.findIndex(cf => cf.text === auText);
                    if (indx >= 0) {
                        allFacets.contributors[indx].count++;
                    } else {
                        allFacets.contributors.push(new Facet({
                            text: auText
                        }));
                    }
                });
            }
            allFacets.contributors.sort((a, b) => (a.count < b.count) ? 1 : -1);

            if (d.pnx.facets.jtitle && d.pnx.facets.jtitle.length > 0) {
                d.pnx.facets.jtitle.forEach(f => {
                    const indx = allFacets.journalTitles.findIndex(tf => tf.text === f);
                    if (indx >= 0) {
                        allFacets.journalTitles[indx].count++;
                    } else {
                        allFacets.journalTitles.push(new Facet({
                            text: f.toString()
                        }));
                    }
                });
            }
            allFacets.journalTitles.sort((a, b) => (a.count < b.count) ? 1 : -1);
        });
        return allFacets;
    }

    public static getTopicFacets(doc: any): Facet[] {
        const topicfacets: Facet[] = [];
        if (doc.pnx.facets.topic && doc.pnx.facets.topic.length > 0) {
            doc.pnx.facets.topic.forEach(f => {
                topicfacets.push(new Facet({
                    text: f.toString()
                }));
            });
        }
        return topicfacets;
    }

    public static getContributorFacets(doc: any): Facet[] {
        const contfacets: Facet[] = [];
        if (doc.pnx.addata.au && doc.pnx.addata.au.length > 0) {
            doc.pnx.addata.au.forEach((f, index) => {
                let names = f.split(',');
                let autext = '';
                autext += names[0];
                if (names.length > 1) {
                    autext += ', ' + names[1];
                }

                text: autext;
                contfacets.push(new Facet({
                    text: autext
                }));
            });
        } else if (doc.pnx.addata.aufirst && doc.pnx.addata.aufirst.length > 0) {
            doc.pnx.addata.aufirst.forEach((f, index) => {
                const auText = (f ? f : '') + ' ' + (doc.pnx.addata.aulast[index] ? doc.pnx.addata.aulast[index] : '');
                contfacets.push(new Facet({
                    text: auText
                }));
            });

        }
        return contfacets;
    }

    public static getJournalTitleFacets(doc: any): Facet[] {
        const journalfacets: Facet[] = [];
        if (doc.pnx.facets.jtitle && doc.pnx.facets.jtitle.length > 0) {
            doc.pnx.facets.jtitle.forEach(f => {
                journalfacets.push(new Facet({
                    text: f.toString()
                }));
            });
        }
        return journalfacets;
    }

    public static getResourceTypeFacets(doc: any): Facet[] {
        const rsTypefacets: Facet[] = [];
        if (doc.pnx.facets.rsrctype && doc.pnx.facets.rsrctype.length > 0) {
            doc.pnx.facets.rsrctype.forEach(f => {
                rsTypefacets.push(new Facet({
                    text: f.toString()
                }));
            });
        }
        return rsTypefacets;
    }

}
