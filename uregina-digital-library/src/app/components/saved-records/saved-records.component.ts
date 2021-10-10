import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Doc } from 'src/app/Models';
import { DataService } from 'src/app/services';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-saved-records',
  templateUrl: './saved-records.component.html',
  styleUrls: ['./saved-records.component.css']
})

export class SavedRecordsComponent implements OnInit {
  @Output() edilAllLabels: EventEmitter<{ all: unknown[], selected: unknown[] }> = new EventEmitter<{ all: unknown[], selected: unknown[] }>();
  docs: Doc[] = [];
  allDocs: Doc[] = [];
  pagingIndex = 0;
  allSelected = false;
  availableLabels = new Set();
  availableLabelsArr = [];
  constructor(private libraryService: LibraryService, private dataService: DataService) { }

  ngOnInit(): void {
    this.getAllSavedDocs();
    this.dataService.myFolderSavedRecordsDeleteAllObs.subscribe(data => {
      console.log(data);
      if (data != null) {
        this.deleteBatchSavedDocs();
      }
    })

    this.dataService.myFolderBatchEditLabelObs.subscribe(data => {
      console.log(data);
      if (data != null) {
        let selectedDocsLabels = new Set();
        let allDocsLabels = new Set();

        this.docs.forEach(d => {
          d.labels.forEach(l => {
            if (d.selected == true) {
              console.log('sel: ', l);
              selectedDocsLabels.add(l)
            } else {
              console.log('unsel: ', l);
              allDocsLabels.add(l);
            }
          });
        });
        console.log('befor emit');
        this.edilAllLabels.emit({ all: Array.from(allDocsLabels), selected: Array.from(selectedDocsLabels) });

      }
    });

    this.dataService.myFolderBatchEditLabelAddAndRemoveObs.subscribe(data => {
      console.log(data);
      if (data != null) {
        this.batchUpdateDocLabel(data);
      }
    });
  }

  getAllSavedDocs() {
    this.libraryService.getAllSavedBaselineDocs().subscribe(res => {
      this.allDocs = [];
      res.forEach(d => {
        if (d.labels && d.labels.length > 0) {
          d.labels.forEach(label => {
            this.availableLabels.add(label);
          });
          this.availableLabelsArr = Array.from(this.availableLabels);
        }
        d['isSaved'] = true;
        this.allDocs.push(new Doc(d));
      });
      this.loadMore();
      console.log(this.docs);
    });
  }

  batchUpdateDocLabel(data) {
    let docIds: string[] = [];
    this.docs.forEach(s => {
      if (s.selected == true) {
        docIds.push(s._id);
      }
    });
    if (data.type == 'add') {
      this.libraryService.addLabelToDocBatch(data.label, docIds).subscribe(res => {
        this.docs.filter(d => d.selected == true).forEach(d => {
          d.labels.push(data.label);
        });
      });
    } else if (data.type == 'remove') {
      this.libraryService.removeLabelFromDocBatch(data.label, docIds).subscribe(res => {
        this.docs.filter(d => d.selected == true).forEach(d => {
          d.labels = d.labels.filter(l => l != data.label);
        });
      });
    }
  }

  loadMore() {
    if (this.pagingIndex < this.allDocs.length) {
      setTimeout(() => {
        let count = 0
        for (let i = this.pagingIndex; i < this.allDocs.length; i++) {
          if (count <= 9) {
            this.docs.push(this.allDocs[i]);
            count++;
          } else {
            break;
          }
        }
        this.pagingIndex += count;
      }, 800)
    }
  }

  refreshDocsAfterRemove(numberDeleted = 1) {
    this.pagingIndex = this.pagingIndex - numberDeleted;
    this.docs = [];
    for (let i = 0; i < this.pagingIndex; i++) {
      this.docs.push(this.allDocs[i]);
    }
  }

  saveToWorkspace(doc: Doc) {
    this.libraryService.deleteBaselineSavedDoc(doc.id).subscribe(res => {
      this.allDocs = this.allDocs.filter(d => !(d.id == doc.id));
      this.refreshDocsAfterRemove();
    });

  }

  allSavedDocsChecked(event: any) {
    // this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.docs.forEach(s => {
        s.selected = true;
      });
    } else {
      this.docs.forEach(s => {
        s.selected = false;
      });
    }
  }

  savedDocChecked(data: { doc: Doc, selected: boolean }) {
    if (this.allSelected == false) {
      this.allSelected = this.docs.every(s => {
        return s.selected == true;
      });
    } else {
      this.allSelected = this.docs.every(s => {
        return s.selected == false;
      });
    }
  }

  deleteBatchSavedDocs() {
    let deleteIds: string[] = [];
    this.docs.forEach(s => {
      if (s.selected == true) {
        deleteIds.push(s._id);
      }
    });
    console.log(deleteIds);
    this.libraryService.deleteBatchBaselineSavedDocs(deleteIds).subscribe(res => {
      console.log(res);
      deleteIds.forEach(id => {
        this.allDocs = this.allDocs.filter(s => !(s._id == id));
      });
      this.refreshDocsAfterRemove(deleteIds.length);
    });
  }



}