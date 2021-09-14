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

    constructor() { }

    updateDocument(data: Doc) {
        this.document.next(data);
    }

    updateTask(task: Task) {
        this.task.next(task);
    }

}