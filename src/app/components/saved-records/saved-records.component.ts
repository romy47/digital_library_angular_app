import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Doc } from 'src/app/models';
import { DataService } from 'src/app/services';
import { LibraryService } from 'src/app/services/library.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { DocumentModelConverter } from 'src/app/utils/model-converter.util';
import { Label } from 'src/app/models/Document-Models/label.model';
declare var $: any;

@Component({
  selector: 'app-saved-records',
  templateUrl: './saved-records.component.html',
  styleUrls: ['./saved-records.component.css']
})

export class SavedRecordsComponent implements OnInit, OnDestroy {
  myFolderSavedRecordsDeleteAllObs: Subscription;
  myFolderBatchEditLabelObs: Subscription;
  myFolderBatchEditLabelAddAndRemoveObs: Subscription;

  @Output() edilAllLabels: EventEmitter<{ all: Label[], selected: Label[] }> = new EventEmitter<{ all: Label[], selected: Label[] }>();
  docs: Doc[] = [];
  allDocs: Doc[] = [];
  pagingIndex = 0;
  allSelected = false;
  availableLabels = new Set();
  availableLabelsArr: Label[] = [];
  LabelFilterActive = false;
  labelFilter: { label: string, docs: Doc[], selected: boolean, hovering: boolean }[] = [{ label: 'Unlabeled items', docs: [], selected: false, hovering: false }];
  docViewing: Doc;
  labels: Label[] = [];

  constructor(private libraryService: LibraryService, private dataService: DataService, private location: Location) { }

  ngOnInit(): void {
    this.getAllSavedDocs();
    this.myFolderSavedRecordsDeleteAllObs = this.dataService.myFolderSavedRecordsDeleteAllObs.subscribe(data => {
      if (data != null) {
        this.deleteBatchSavedDocs();
      }
    });

    this.myFolderBatchEditLabelObs = this.dataService.myFolderBatchEditLabelObs.subscribe(data => {
      if (data != null) {
        let selectedDocsLabels = [];
        let allDocsLabels = [];
        this.docs.forEach(d => {
          d.labelsPopulated.forEach(l => {
            if (d.selected == true) {
              const existingLabel = selectedDocsLabels.find(label => label._id == l._id);
              if (existingLabel == null) {
                selectedDocsLabels.push(l)
              }
            } else {
              const existingLabel = allDocsLabels.find(label => label._id == l._id);
              if (existingLabel == null) {
                allDocsLabels.push(l)
              }
            }
          });
        });
        this.edilAllLabels.emit({ all: allDocsLabels, selected: selectedDocsLabels });
      }
    });

    this.myFolderBatchEditLabelAddAndRemoveObs = this.dataService.myFolderBatchEditLabelAddAndRemoveObs.subscribe(data => {
      if (data != null) {
        this.batchUpdateDocLabel(data);
      }
    });

    this.location.subscribe(location => {
      this.closeModal();
      this.closeFilterModal();
    });
  }

  ngOnDestroy() {
    this.myFolderSavedRecordsDeleteAllObs.unsubscribe();
    this.myFolderBatchEditLabelObs.unsubscribe();
    this.myFolderBatchEditLabelAddAndRemoveObs.unsubscribe();
  }


  viewDocument(input: { data: Doc, type: string }) {
    if (input.type == 'checked') {

    }
    else if (input.type == 'view') {
      this.docViewing = input.data;
      setTimeout(() => {
        $('#serpDocViewModal').appendTo("body").modal('show');
      }, 200)

    } else {
      let doc = input.data;
      if (doc.rawObject.delivery && doc.rawObject.delivery.GetIt1 && doc.rawObject.delivery.GetIt1.length > 0 && doc.rawObject.delivery.GetIt1[0].links && doc.rawObject.delivery.GetIt1[0].links.length > 0 && doc.rawObject.delivery.GetIt1[0].links[0].link) {
        let url = doc.rawObject.delivery.GetIt1[0].links[0].link;
        let sbDomain = 'casls-regina.userservices.exlibrisgroup.com/view/uresolver/01CASLS_REGINA/openurl';
        var pattern = /1.1.1.1+/g;
        url = url.replace(pattern, sbDomain);
        window.open(url, '_blanc');
      }
    }
  }

  closeModal() {
    $('#serpDocViewModal').modal('hide');
  }

  openFilterModal() {
    setTimeout(() => {
      $('#labelFilterModal').appendTo("body").modal('show');
    }, 200);
  }

  closeFilterModal() {
    setTimeout(() => {
      $('#labelFilterModal').modal('hide');
    }, 200);
  }

  filterLabelClick(label) {
    label.selected = !label.selected;
    this.LabelFilterActive = this.labelFilter.filter(l => l.selected == true).length > 0;

    this.getAllSavedDocs(true);
  }

  clearLabelSelection() {
    this.labelFilter.forEach(l => {
      l.selected = false;
    });
    this.LabelFilterActive = false;
    this.getAllSavedDocs(true);
  }

  filterLabelMouseEnter(label) {
    label.hovering = true;
  }

  filterLabelMouseLeave(label) {
    label.hovering = false;
  }

  getAllSavedDocs(filteringByLabel = false) {
    this.pagingIndex = 0;
    this.docs = [];
    this.libraryService.getAllSavedBaselineDocs().subscribe(res => {
      this.allDocs = [];
      res.data.slice().reverse().forEach(d => {
        if (d.labelsPopulated && d.labelsPopulated.length > 0) {
          d.labelsPopulated.forEach(label => {
            const existingLabel = this.labels.find(l => l._id == label._id)
            if (existingLabel == null) {
              this.labels.push(label)
            }
          });
        }
        let savedDoc = new Doc(d);
        let convertedDoc = DocumentModelConverter.formatSingleDocumentModel(d.rawObject);
        savedDoc.snippet = convertedDoc.snippet;
        savedDoc.description = convertedDoc.description;
        savedDoc.language = convertedDoc.language;
        savedDoc.identifier = convertedDoc.identifier;
        savedDoc.secondarySource = convertedDoc.secondarySource;
        savedDoc.source = convertedDoc.source;
        savedDoc.allIdentifiers = convertedDoc.allIdentifiers;
        savedDoc['isSaved'] = true;
        this.allDocs.push(savedDoc);
      });
      if (filteringByLabel == false) {
        this.loadLabelFilter();
      }
      if (filteringByLabel) {
        let allDocsBackup = this.allDocs;
        this.allDocs = [];
        let selectedFilters = [];
        let selectedFiltersSet = new Set();
        this.labelFilter.forEach(l => {
          if (l.selected == true) { selectedFiltersSet.add(l.label); }
        });
        selectedFilters = Array.from(selectedFiltersSet);
        allDocsBackup.forEach((d, index) => {
          let docAllowed = false;
          d.labelsPopulated.forEach(l => {
            if (selectedFilters.includes(l)) {
              docAllowed = true;
            }
          });
          // update
          if (d.labelsPopulated.length == 0 && selectedFilters.includes("Unlabeled items")) {
            docAllowed = true;
          }
          if ((this.LabelFilterActive == false) || (docAllowed && this.allDocs.filter(ad => ad._id == d._id).length < 1)) {
            this.allDocs.push(d)
          }
        });
      }
      this.loadMore();
    });
  }

  loadLabelFilter() {
    let allLabels = new Set();
    this.allDocs.forEach(d => {
      if (d.labelsPopulated.length < 1) {
        this.labelFilter[0].docs.push(d);
      } else {
        d.labelsPopulated.forEach(l => {
          allLabels.add(l);
        });
      }
    });
    Array.from(allLabels).forEach(l => {
      this.labelFilter.push({ label: l.toString(), docs: [], selected: false, hovering: false });
    });

    this.allDocs.forEach(d => {
      d.labelsPopulated.forEach(lbl => {
        let index = this.labelFilter.findIndex(lf => lf.label == lbl.title);
        if (index > -1) {
          this.labelFilter[index].docs.push(d);
        }
      });
    });
  }

  batchUpdateDocLabel(data) {
    const documents = this.docs.filter(d => d.selected == true);
    if (data.type == 'add') {
      this.libraryService.addBatchBaselineSavedDoc(documents, data.label, null).subscribe(res => {
        this.docs.filter(d => d.selected == true).forEach(d => {
          d.labelsPopulated.push(data.label);
        });
      });
    } else if (data.type == 'remove') {
      this.libraryService.addBatchBaselineSavedDoc(documents, null, data.label).subscribe(res => {
        this.docs.filter(d => d.selected == true).forEach(d => {
          d.labelsPopulated = d.labelsPopulated.filter(l => l._id != data.label._id);
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
    this.libraryService.deleteBaselineSavedDoc(doc._id).subscribe(res => {
      this.allDocs = this.allDocs.filter(d => !(d.id == doc.id));
      this.refreshDocsAfterRemove();
      $('#serpDocViewModal').modal('hide');
    });
  }

  allSavedDocsChecked(event: any) {
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
    this.libraryService.deleteBatchBaselineSavedDocs(deleteIds).subscribe(res => {
      deleteIds.forEach(id => {
        this.allDocs = this.allDocs.filter(s => !(s._id == id));
      });
      this.refreshDocsAfterRemove(deleteIds.length);
    });
  }
}
