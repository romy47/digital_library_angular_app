import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { NavigationExtras, Router } from '@angular/router';
import { Doc } from 'src/app/Models';
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
  username = '';
  newLabel = '';
  @ViewChild('mtfolderEditLabelBtn') menuBtn: MatMenuTrigger;
  batchEditLabel: { all: string[], selected: string[] } = { all: [], selected: [] };



  ngOnInit(): void {
    this.username = this.authService.getCurrentUserData().name;
  }

  forceRefresh(tab: number) {
    switch (tab) {
      case 0:
        break;
      case 1:
        this.dataService.updateMyFolderSavedSearchForceRefresh(1)
        break;
      default:
        break;
    }
  }

  edilAllLabels(data: { all: string[], selected: string[] }) {
    console.log(data);
    this.batchEditLabel = data;
    setTimeout(() => {
      this.menuBtn.openMenu();
    }, 100);

  }

  changeLabel(label: string, type: string) {
    this.dataService.updatemyFolderBatchEditLabelAddAndRemove({ label: label, type: type });
  }

  onTabChanged(event: any) {
    console.log(this.selectedTabIndex);
  }


  saveBatchSearchedHistory() {
    this.dataService.updateMyFolderSearchHistorySaveAll(1);
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

  editBatchSavedRecordsLabels() {
    this.dataService.updateMyFolderBatchEditLabel(1);
  }

  submitLabel() {
    this.dataService.updatemyFolderBatchEditLabelAddAndRemove({ label: this.newLabel, type: 'add' });
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
