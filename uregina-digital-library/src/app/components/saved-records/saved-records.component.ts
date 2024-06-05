import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Doc } from 'src/app/Models';
import { DataService } from 'src/app/services';
import { LibraryService } from 'src/app/services/library.service';
import { customLog } from 'src/app/Utils/log.util';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { DocumentModelConverter } from 'src/app/Utils/model-converter.util';
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

  @Output() edilAllLabels: EventEmitter<{ all: unknown[], selected: unknown[] }> = new EventEmitter<{ all: unknown[], selected: unknown[] }>();
  docs: Doc[] = [];
  allDocs: Doc[] = [];
  pagingIndex = 0;
  allSelected = false;
  availableLabels = new Set();
  availableLabelsArr = [];
  LabelFilterActive = false;
  labelFilter: { label: string, docs: Doc[], selected: boolean, hovering: boolean }[] = [{ label: 'Unlabeled items', docs: [], selected: false, hovering: false }];
  docViewing: Doc;

  constructor(private libraryService: LibraryService, private dataService: DataService, private location: Location) { }

  ngOnInit(): void {
    this.getAllSavedDocs();
    this.myFolderSavedRecordsDeleteAllObs = this.dataService.myFolderSavedRecordsDeleteAllObs.subscribe(data => {
      if (data != null) {
        console.log(data);
        console.log('3--btch called--3');
        this.deleteBatchSavedDocs();
      }
    });

    this.myFolderBatchEditLabelObs = this.dataService.myFolderBatchEditLabelObs.subscribe(data => {
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

    this.myFolderBatchEditLabelAddAndRemoveObs = this.dataService.myFolderBatchEditLabelAddAndRemoveObs.subscribe(data => {
      console.log(data);
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
      // this.docCheckCount = this.documents.filter(d => d.selected == true).length;
    }
    else if (input.type == 'view') {
      // input.data.page = this.currentPage;
      // Object.assign(this.docViewing, input.data);
      this.docViewing = input.data;
      // console.log("lalalalalalalalalalalalalal", this.docViewing)
      setTimeout(() => {
        $('#serpDocViewModal').appendTo("body").modal('show');
      }, 200)
      customLog('view-doc', this.docViewing.title, this.docViewing.id);

    } else {
      let doc = input.data;
      if (doc.rawObject.delivery && doc.rawObject.delivery.GetIt1 && doc.rawObject.delivery.GetIt1.length > 0 && doc.rawObject.delivery.GetIt1[0].links && doc.rawObject.delivery.GetIt1[0].links.length > 0 && doc.rawObject.delivery.GetIt1[0].links[0].link) {
        let url = doc.rawObject.delivery.GetIt1[0].links[0].link;
        let sbDomain = 'casls-regina.userservices.exlibrisgroup.com/view/uresolver/01CASLS_REGINA/openurl';
        var pattern = /1.1.1.1+/g;
        url = url.replace(pattern, sbDomain);
        console.log(url)
        window.open(url, '_blanc');
        customLog('get-doc', doc.title, doc.id);
      }
    }
  }

  closeModal() {
    $('#serpDocViewModal').modal('hide');
    customLog('doc-view-modal-close-clicked');
  }

  openFilterModal() {
    setTimeout(() => {
      $('#labelFilterModal').appendTo("body").modal('show');
    }, 200);
  }

  closeFilterModal() {
    // console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
    setTimeout(() => {
      $('#labelFilterModal').modal('hide');
    }, 200);
  }

  filterLabelClick(label) {
    label.selected = !label.selected;
    this.LabelFilterActive = this.labelFilter.filter(l => l.selected == true).length > 0;

    this.getAllSavedDocs(true);
    customLog("label-filter-clicked");
  }

  clearLabelSelection() {
    this.labelFilter.forEach(l => {
      l.selected = false;
    });
    this.LabelFilterActive = false;
    this.getAllSavedDocs(true);
    customLog("label-filter-cleared");
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
      res.slice().reverse().forEach(d => {
        if (d.labels && d.labels.length > 0) {
          d.labels.forEach(label => {
            this.availableLabels.add(label);
          });
          this.availableLabelsArr = Array.from(this.availableLabels);
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
      console.log(this.docs);
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
        console.log('p-0', selectedFilters.length);
        allDocsBackup.forEach((d, index) => {
          console.log('p-', index);

          let docAllowed = false;
          d.labels.forEach(l => {
            if (selectedFilters.includes(l)) {
              docAllowed = true;
              // console.log(l, ' matched with: ', selectedFilters[0], ' ', selectedFilters[1], ' ', selectedFilters[3]);
            } else {
              // console.log(l, ' not matched with: ', selectedFilters[0], ' ', selectedFilters[1], ' ', selectedFilters[3]);

            }
          });

          // update
          if (d.labels.length == 0 && selectedFilters.includes("Unlabeled items")) {
            docAllowed = true;
          }
          console.log('docAllowed status', docAllowed)
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
      console.log('Labeller Phase -2');
      if (d.labels.length < 1) {
        console.log('Labeller Phase -1')
        this.labelFilter[0].docs.push(d);
      } else {
        console.log('Labeller Phase -0.5')
        d.labels.forEach(l => {
          allLabels.add(l);
        });
      }
    });
    console.log('Labeller Phase 0', allLabels);
    Array.from(allLabels).forEach(l => {
      this.labelFilter.push({ label: l.toString(), docs: [], selected: false, hovering: false });
    });
    console.log('Labeller Phase 1', this.labelFilter);

    this.allDocs.forEach(d => {
      d.labels.forEach(lbl => {
        let index = this.labelFilter.findIndex(lf => lf.label == lbl);
        if (index > -1) {
          this.labelFilter[index].docs.push(d);
        }
      });
    });
    console.log(this.labelFilter);
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
        customLog('batch-add-label-from-saved-records', data.label);
        this.docs.filter(d => d.selected == true).forEach(d => {
          d.labels.push(data.label);
        });
      });
    } else if (data.type == 'remove') {
      this.libraryService.removeLabelFromDocBatch(data.label, docIds).subscribe(res => {
        customLog('batch-remove-label-from-saved-records', data.label);
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
        // customLog('load-more-saved-records', this.pagingIndex.toString());
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
      $('#serpDocViewModal').modal('hide');
      customLog('removed-saved-document', doc.title, doc.id);
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
      customLog('batch-remove-saved-document');
      console.log(res);
      deleteIds.forEach(id => {
        this.allDocs = this.allDocs.filter(s => !(s._id == id));
      });
      this.refreshDocsAfterRemove(deleteIds.length);
    });
  }



}
