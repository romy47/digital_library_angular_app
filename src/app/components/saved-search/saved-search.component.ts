import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Search } from 'src/app/models';
import { DataService, LibraryService } from 'src/app/services';

@Component({
  selector: 'app-saved-search',
  templateUrl: './saved-search.component.html',
  styleUrls: ['./saved-search.component.css']
})
export class SavedSearchComponent implements OnInit {
  myFolderSavedSearchesDeleteAllObs: Subscription;
  myFolderSavedSearchForceRefreshObs: Subscription;

  searches: Search[] = [];
  allSearches: Search[] = [];
  pagingIndex = 0;
  allSelected = false;

  constructor(private libraryService: LibraryService, private dataService: DataService) { }

  ngOnInit(): void {
    this.getAllSavedSearches();
    this.myFolderSavedSearchesDeleteAllObs = this.dataService.myFolderSavedSearchesDeleteAllObs.subscribe(data => {
      if (data != null) {
        this.deleteBatchSavedSearch();
      }
    });

    this.myFolderSavedSearchForceRefreshObs = this.dataService.myFolderSavedSearchForceRefreshObs.subscribe(data => {
      if (data != null) {
        this.getAllSavedSearches();
      }
    })
  }

  ngOnDestroy() {
    this.myFolderSavedSearchesDeleteAllObs.unsubscribe();
    this.myFolderSavedSearchForceRefreshObs.unsubscribe();
  }

  getAllSavedSearches() {
    this.libraryService.getAllSavedBaselineSearches().subscribe(res => {
      this.searches = [];
      this.allSearches = [];
      this.pagingIndex = 0;
      res.data.slice().reverse().forEach(t => {
        t['selected'] = false;
        this.allSearches.push(new Search(t));
      });
      this.loadMore();
    });

  }

  deleteBatchSavedSearch() {
    let deleteIds: string[] = [];
    this.searches.forEach(s => {
      if (s.selected == true) {
        deleteIds.push(s._id);
      }
    });
    this.libraryService.deleteBatchBaselineSavedSearch(deleteIds).subscribe(res => {
      deleteIds.forEach(id => {
        this.allSearches = this.allSearches.filter(s => !(s._id == id));
      });
      this.refreshDocsAfterRemove(deleteIds.length);
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

  saveToWorkspace(search: Search) {
    this.libraryService.deleteBaselineSavedSearch(search._id).subscribe(res => {
      this.allSearches = this.allSearches.filter(s => !(s._id == search._id));
      this.refreshDocsAfterRemove();
    });
  }

  allSavedSearchChecked(event: any) {
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

  savedSearchChecked(search: Search) {
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
}
