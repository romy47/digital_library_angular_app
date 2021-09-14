import { Facet } from "../Models";

export class FacetSortHelper {
    public static sortFacetsBySelectionAndAvilabilityAndCount(pageFacets: Facet[]): Facet[] {
        pageFacets.sort((a, b) => {
            if (a.isSelected < b.isSelected) {
                return 1;
            } else if (a.isSelected > b.isSelected) {
                return -1;
            } else { //equal
                if ((a.selectLevel == 2) > (b.selectLevel == 2)) {
                    return -1;
                } else if ((a.selectLevel == 2) < (b.selectLevel == 2)) {
                    return 1;
                } else { //equal
                    if (a.count > b.count) {
                        return -1;
                    } else if (a.count < b.count) {
                        return +1;
                    } else { //equal
                        return 0;
                    }
                }
            }
        });
        return pageFacets;
    }

    public static sortFacetsByAvilabilityAndCount(pageFacets: Facet[]): Facet[] {
        pageFacets.sort((a, b) => {
            if ((a.selectLevel == 2) > (b.selectLevel == 2)) {
                return -1;
            } else if ((a.selectLevel == 2) < (b.selectLevel == 2)) {
                return 1;
            } else { //equal
                if (a.count > b.count) {
                    return -1;
                } else if (a.count < b.count) {
                    return +1;
                } else { //equal
                    return 0;
                }
            }
        });
        return pageFacets;
    }
}