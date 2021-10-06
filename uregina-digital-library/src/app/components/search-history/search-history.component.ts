import { Component, OnInit } from '@angular/core';
import { Search } from 'src/app/Models';
import { DataService, LibraryService } from 'src/app/services';

@Component({
  selector: 'app-search-history',
  templateUrl: './search-history.component.html',
  styleUrls: ['./search-history.component.css']
})
export class SearchHistoryComponent implements OnInit {

  searches: Search[] = [];
  allSearches: Search[] = [];
  allSelected: boolean = false;
  savedSearcheQueryTitles = new Set();

  pagingIndex = 0;
  constructor(private libraryService: LibraryService, private dataService: DataService) { }

  ngOnInit(): void {
    this.libraryService.getAllSavedBaselineSearches().subscribe(res => {
      res.forEach(t => {
        this.savedSearcheQueryTitles.add(t.searchQuery);
      });
      this.getAllSearches();
    });

    this.dataService.myFolderSearchHistoryDeleteAllObs.subscribe(data => {
      console.log(data);
      if (data != null) {
        this.deleteBatchSearchHistory();
      }
    })
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
    // this.libraryService.getAllSavedBaselineSearches().subscribe(res => {
    //   this.allSearches = [];
    //   res.forEach(t => {
    //     if (this.savedSearcheQueryTitles.has(t.searchQuery)) {
    //       t['isSaved'] = true;
    //     }
    //     this.allSearches.push(new Search(t));
    //   });
    //   console.log(this.savedSearcheQueryTitles);
    //   console.log(this.allSearches);
    //   this.loadMore();
    // });



    this.libraryService.getAllBaselineSearches().subscribe(res => {
      this.allSearches = [];
      res.forEach(t => {
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

  saveToWorkspace(search: Search) {
    this.libraryService.deleteBaselineSearchHistory(search._id).subscribe(res => {
      this.allSearches = this.allSearches.filter(s => !(s._id == search._id));
      this.refreshDocsAfterRemove();
    });
  }

  deleteBatchSearchHistory() {
    let deleteIds: string[] = [];
    this.searches.forEach(s => {
      if (s.selected == true) {
        deleteIds.push(s._id);
      }
    });
    console.log(deleteIds);
    this.libraryService.deleteBatchBaselineSearchHistory(deleteIds).subscribe(res => {
      console.log(res);
      deleteIds.forEach(id => {
        this.allSearches = this.allSearches.filter(s => !(s._id == id));
      });
      this.refreshDocsAfterRemove(deleteIds.length);
    });
  }
}