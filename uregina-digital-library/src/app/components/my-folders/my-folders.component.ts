import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DataService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-folders',
  templateUrl: './my-folders.component.html',
  styleUrls: ['./my-folders.component.css']
})
export class MyFoldersComponent implements OnInit {
  searchQuery = '';
  selectedTabIndex = 0;
  constructor(private authService: AuthService, private router: Router, private dataService: DataService) { }
  username = "";

  ngOnInit(): void {
    this.username = this.authService.getCurrentUserData().name;

  }

  onTabChanged(event: any) {
    console.log(this.selectedTabIndex);
  }

  deleteBatchSearchedHistory() {
    this.dataService.updateMyFolderSearchHistoryDeleteAll(1);
  }

  deleteBatchSavedSearch() {
    this.dataService.updateMyFolderSavedSearchesDeleteAll(1);
  }

  deleteBatchSavedRecords() {
    this.dataService.updateMyFolderSavedRecordsDeleteAll(1);
  }

  search() {
    const extras: NavigationExtras = {
      queryParams: {
        query: this.searchQuery
      }
    };
    this.router.navigate(['/library/search'], extras);
  }

}
