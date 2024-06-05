import { Facet, Colour } from 'src/app/Models/index';


export class ColourUtil {
    static ALLColours: string[] = [
        '#8dd3c7',
        '#ffffb3',
        '#bebada',
        '#fb8072',
        '#80b1d3',
        '#fdb462',
        '#b3de69',
        '#fccde5',
        '#d9d9d9',
        '#bc80bd'];
    static subjects: string[] = [
        'Machine Learning',
        'Neural Network',
        'Information Visualization',
        'Data Mining',
        'Data Science',
        'Bayesian Networks',
        'Topic Modeling',
        'Faceted Navigation',
        'Digital Library',
        'Interactive information visualization'];

    public static getArr(max: number) {
        let arr = [];
        while (arr.length < max) {
            let r = Math.floor(Math.random() * max) + 1;
            if (arr.indexOf(r) === -1) { arr.push(r); }
        }
        // console.log(arr);
        return arr;
    }

    public static getDistinctColors(count: number): Colour[] {
        const colors: Colour[] = [];
        count > 10 ? count = 10 : count = count;
        for (let i = 0; i < count; i++) {
            colors.push(new Colour({
                value: ColourUtil.ALLColours[i],
                isSelected: false
            }));
        }
        return colors;
    }
    public static getDistinctColouredFacets(max: number = 10): Facet[] {

        const arr: Facet[] = [];
        const arr2 = this.getArr(max);
        for (let i = 0; i < max; i++) {
            const fac = new Facet({
                text: ColourUtil.subjects[i],
                count: 0
            });
            arr.push(fac);
        }
        return arr;
    }
}
