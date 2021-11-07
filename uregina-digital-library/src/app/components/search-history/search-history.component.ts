import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Search } from 'src/app/Models';
import { DataService, LibraryService } from 'src/app/services';
import { customLog } from 'src/app/Utils/log.util';

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
      res.slice().reverse().forEach(t => {
        this.savedSearcheQueryTitles.add(t.searchQuery);
      });
      this.getAllSearches();
    });

    this.myFolderSearchHistoryDeleteAllObs = this.dataService.myFolderSearchHistoryDeleteAllObs.subscribe(data => {
      console.log(data);
      console.log('--batch delete subscribe--');
      if (data != null) {
        this.deleteBatchSearchHistory();
      }
    });

    this.myFolderSearchHistorySaveAllObs = this.dataService.myFolderSearchHistorySaveAllObs.subscribe(data => {
      console.log(data);
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
      customLog('save-search-history-from-history', search.searchQuery, search._id);
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
      res.slice().reverse().forEach(t => {
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
        // customLog('load-more-search-history', this.pagingIndex.toString());
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
        customLog('removed-search-history', search.searchQuery, search._id);
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
    console.log('batch delete: ', deleteIds);
    this.libraryService.deleteBatchBaselineSearchHistory(deleteIds).subscribe(res => {
      if (log == true) {
        customLog('batch-remove-search-history');
      }
      console.log(res);
      deleteIds.forEach(id => {
        this.allSearches = this.allSearches.filter(s => !(s._id == id));
      });
      this.refreshDocsAfterRemove(deleteIds.length);
    });
  }

  saveBatchSearchHistory() {
    const searchesToBeSaved = this.searches.filter(s => s.selected == true);
    console.log('batch delete prelode');

    this.libraryService.addBatchBaselineSavedSearch(searchesToBeSaved).subscribe(res => {
      customLog('batch-save-search-history');
      console.log('batch delete started');
      this.deleteBatchSearchHistory(false);
    }, err => {
      console.log('Err', err);
    })
  }
}