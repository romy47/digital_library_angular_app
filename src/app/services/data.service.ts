import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Doc, Task } from '../models';
import { Label } from '../models/Document-Models/label.model';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private document: Subject<Doc> = new Subject<Doc>();
    documentObs = this.document.asObservable();

    private task: Subject<Task> = new Subject<Task>();
    taskObs = this.task.asObservable();

    // Unsubscription handled
    private myFolderSearchHistoryDeleteAll: Subject<number> = new Subject<number>();
    myFolderSearchHistoryDeleteAllObs = this.myFolderSearchHistoryDeleteAll.asObservable();

    // Unsubscription handled
    private myFolderSearchHistorySaveAll: Subject<number> = new Subject<number>();
    myFolderSearchHistorySaveAllObs = this.myFolderSearchHistorySaveAll.asObservable();

    // Unsubscription handled
    private myFolderSavedSearchesDeleteAll: Subject<number> = new Subject<number>();
    myFolderSavedSearchesDeleteAllObs = this.myFolderSavedSearchesDeleteAll.asObservable();

    // Unsubscription handled
    private myFolderSavedRecordsDeleteAll: Subject<number> = new Subject<number>();
    myFolderSavedRecordsDeleteAllObs = this.myFolderSavedRecordsDeleteAll.asObservable();

    // Unsubscription handled
    private myFolderSavedSearchForceRefresh: Subject<number> = new Subject<number>();
    myFolderSavedSearchForceRefreshObs = this.myFolderSavedSearchForceRefresh.asObservable();

    // Unsubscription handled
    private myFolderBatchEditLabel: Subject<number> = new Subject<number>();
    myFolderBatchEditLabelObs = this.myFolderBatchEditLabel.asObservable();

    // Unsubscription handled
    private myFolderBatchEditLabelAddAndRemove: Subject<{ label: Label, type: string }> = new Subject<{ label: Label, type: string }>();
    myFolderBatchEditLabelAddAndRemoveObs = this.myFolderBatchEditLabelAddAndRemove.asObservable();

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

    updateMyFolderSearchHistorySaveAll(data: number) {
        this.myFolderSearchHistorySaveAll.next(data);
    }

    updateMyFolderSavedSearchesDeleteAll(data: number) {
        this.myFolderSavedSearchesDeleteAll.next(data);
    }

    updateMyFolderSavedRecordsDeleteAll(data: number) {
        this.myFolderSavedRecordsDeleteAll.next(data);
    }

    updateMyFolderSavedSearchForceRefresh(data: number) {
        this.myFolderSavedSearchForceRefresh.next(data);
    }

    updateMyFolderBatchEditLabel(data: number) {
        this.myFolderBatchEditLabel.next(data);
    }

    updatemyFolderBatchEditLabelAddAndRemove(data: { label: Label, type: string }) {
        this.myFolderBatchEditLabelAddAndRemove.next(data);
    }


}