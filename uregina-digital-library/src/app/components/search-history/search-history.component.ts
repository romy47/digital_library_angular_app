import { Component, OnInit } from '@angular/core';
import { Search } from 'src/app/Models';
import { LibraryService } from 'src/app/services';

@Component({
  selector: 'app-search-history',
  templateUrl: './search-history.component.html',
  styleUrls: ['./search-history.component.css']
})
export class SearchHistoryComponent implements OnInit {

  searches: Search[];
  constructor(private libraryService: LibraryService) { }

  ngOnInit(): void {
    this.getAllSearches();
  }

  getAllSearches() {
    this.libraryService.getAllBaselineSearches().subscribe(res => {
      this.searches = [];
      res.forEach(t => {
        t['selected'] = false;
        this.searches.push(new Search(t));
      });
      console.log(this.searches);
    });
  }

}
