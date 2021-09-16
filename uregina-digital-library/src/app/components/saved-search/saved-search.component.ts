import { Component, OnInit } from '@angular/core';
import { Search } from 'src/app/Models';
import { LibraryService } from 'src/app/services';

@Component({
  selector: 'app-saved-search',
  templateUrl: './saved-search.component.html',
  styleUrls: ['./saved-search.component.css']
})
export class SavedSearchComponent implements OnInit {

  searches: Search[];

  constructor(private libraryService: LibraryService) { }

  ngOnInit(): void {
    this.getAllSavedSearches();
  }

  getAllSavedSearches() {
    this.libraryService.getAllSavedBaselineSearches().subscribe(res => {
      this.searches = [];
      res.forEach(t => {
        t['selected'] = false;
        this.searches.push(new Search(t));
      });
      console.log(this.searches);
    });
  }

}
