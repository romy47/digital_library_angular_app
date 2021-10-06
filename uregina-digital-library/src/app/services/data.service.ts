import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Doc, Task } from '../Models';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private document: BehaviorSubject<Doc> = new BehaviorSubject<Doc>(new Doc({}));
    documentObs = this.document.asObservable();

    private task: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);
    taskObs = this.task.asObservable();

    private myFolderSearchHistoryDeleteAll: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    myFolderSearchHistoryDeleteAllObs = this.myFolderSearchHistoryDeleteAll.asObservable();


    private myFolderSavedSearchesDeleteAll: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    myFolderSavedSearchesDeleteAllObs = this.myFolderSavedSearchesDeleteAll.asObservable();

    private myFolderSavedRecordsDeleteAll: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    myFolderSavedRecordsDeleteAllObs = this.myFolderSavedRecordsDeleteAll.asObservable();

    constructor() { }

    updateDocument(data: Doc) {
        this.document.next(data);
    }

    updateTask(task: Task) {
        this.task.next(task);
    }

    updateMyFolderSearchHistoryDeleteAll(data: number) {
        this.myFolderSearchHistoryDeleteAll.next(data);
    }

    updateMyFolderSavedSearchesDeleteAll(data: number) {
        this.myFolderSavedSearchesDeleteAll.next(data);
    }

    updateMyFolderSavedRecordsDeleteAll(data: number) {
        this.myFolderSavedRecordsDeleteAll.next(data);
    }


}