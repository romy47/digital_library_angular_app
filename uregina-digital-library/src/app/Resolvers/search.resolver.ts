import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { EMPTY, Observable, of } from "rxjs";
import { take, mergeMap, catchError } from 'rxjs/operators'
import { Doc } from "../Models";
import { DataService, LibraryService } from "../services";

@Injectable({ providedIn: 'root' })
export class SearchResolver implements Resolve<Doc[]> {
    constructor(private service: LibraryService, private dataService: DataService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Doc[]> | Promise<Doc[]> | any {

        return this.service.getAllSavedBaselineDocs().pipe(catchError(err => {
            return EMPTY
        }), mergeMap(res => {
            console.log('Resolver Calling', res);
            let docs = [];
            res.slice().reverse().forEach(d => {
                docs.push(new Doc(d));
            });
            return of(docs);
        }));
    }
}
