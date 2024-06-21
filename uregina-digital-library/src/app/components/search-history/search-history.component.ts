import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Search } from 'src/app/models';
import { DataService, LibraryService } from 'src/app/services';

@Component({
  selector: 'app-search-history',
  templateUrl: './search-history.component.html',
  styleUrls: ['./search-history.component.css']
})
export class SearchHistoryComponent implements OnInit, OnDestroy {
  myFolderSearchHistoryDeleteAllObs: Subscription;
  myFolderSearchHistorySaveAllObs: Subscription;

  searches: Search[] = [];
  allSearches: Search[] = [];
  allSelected: boolean = false;
  savedSearcheQueryTitles = new Set();
  @Output() forceRefresh: EventEmitter<number> = new EventEmitter<number>();

  pagingIndex = 0;
  constructor(private libraryService: LibraryService, private dataService: DataService) { }

  ngOnInit(): void {
    this.libraryService.getAllSavedBaselineSearches().subscribe(res => {
      res.data.slice().reverse().forEach(t => {
        this.savedSearcheQueryTitles.add(t.searchQuery);
      });
      this.getAllSearches();
    });

    this.myFolderSearchHistoryDeleteAllObs = this.dataService.myFolderSearchHistoryDeleteAllObs.subscribe(data => {
      if (data != null) {
        this.deleteBatchSearchHistory();
      }
    });

    this.myFolderSearchHistorySaveAllObs = this.dataService.myFolderSearchHistorySaveAllObs.subscribe(data => {
      if (data != null) {
        this.saveBatchSearchHistory();
      }
    });
  }

  ngOnDestroy() {
    this.myFolderSearchHistoryDeleteAllObs.unsubscribe();
    this.myFolderSearchHistorySaveAllObs.unsubscribe();
  }

  allSearchHistoryChecked(event: any) {
    // this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.searches.forEach(s => {
        s.selected = true;
      });
    } else {
      this.searches.forEach(s => {
        s.selected = false;
      });
    }
  }

  addToSavedSearch(search: Search) {
    this.libraryService.addBaselineSavedSearch(search.searchQuery, 0, 0).subscribe(res => {
      this.forceRefresh.emit(1);
      this.saveToWorkspace(search, false);
    });
  }


  searchHistoryChecked(search: Search) {
    if (this.allSelected == false) {
      this.allSelected = this.searches.every(s => {
        return s.selected == true;
      });
    } else {
      this.allSelected = this.searches.every(s => {
        return s.selected == false;
      });
    }
  }

  getAllSearches() {
    this.libraryService.getAllBaselineSearches().subscribe(res => {
      this.allSearches = [];
      res.data.slice().reverse().forEach(t => {
        t['selected'] = false;
        if (this.savedSearcheQueryTitles.has(t.searchQuery)) {
          t['isSaved'] = true;
        }
        this.allSearches.push(new Search(t));
      });
      this.loadMore();
    });
  }

  loadMore() {
    if (this.pagingIndex < this.allSearches.length) {
      setTimeout(() => {
        let count = 0
        for (let i = this.pagingIndex; i < this.allSearches.length; i++) {
          if (count <= 9) {
            this.searches.push(this.allSearches[i]);
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
    this.searches = [];
    for (let i = 0; i < this.pagingIndex; i++) {
      this.searches.push(this.allSearches[i]);
    }
  }

  saveToWorkspace(search: Search, log = true) {
    this.libraryService.deleteBaselineSearchHistory(search._id).subscribe(res => {
      this.allSearches = this.allSearches.filter(s => !(s._id == search._id));
      this.refreshDocsAfterRemove();
      if (log == true) {
      }
    });
  }

  deleteBatchSearchHistory(log = true) {
    let deleteIds: string[] = [];
    this.searches.forEach(s => {
      if (s.selected == true) {
        deleteIds.push(s._id);
      }
    });
    this.libraryService.deleteBatchBaselineSearchHistory(deleteIds).subscribe(res => {
      if (log == true) {
      }
      deleteIds.forEach(id => {
        this.allSearches = this.allSearches.filter(s => !(s._id == id));
      });
      this.refreshDocsAfterRemove(deleteIds.length);
    });
  }

  saveBatchSearchHistory() {
    const searchesToBeSaved = this.searches.filter(s => s.selected == true);

    this.libraryService.addBatchBaselineSavedSearch(searchesToBeSaved).subscribe(res => {
      this.deleteBatchSearchHistory(false);
    }, err => {
    })
  }
}