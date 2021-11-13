import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Doc } from 'src/app/Models';
import { DataService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth.service';
import { customLog } from 'src/app/Utils/log.util';

@Component({
  selector: 'app-my-folders',
  templateUrl: './my-folders.component.html',
  styleUrls: ['./my-folders.component.css']
})




export class MyFoldersComponent implements OnInit {
  searchQuery = '';
  selectedTabIndex = 0;
  constructor(private authService: AuthService, private router: Router, private dataService: DataService, private route: ActivatedRoute) { }
  username = '';
  newLabel = '';
  @ViewChild('mtfolderEditLabelBtn') menuBtn: MatMenuTrigger;
  batchEditLabel: { all: string[], selected: string[] } = { all: [], selected: [] };



  ngOnInit(): void {
    customLog('myfolder-reached');
    this.searchQuery = this.route.snapshot.queryParamMap.get('query');
    this.username = this.authService.getCurrentUserData().name;
  }

  startTask() {
    customLog("start-session2-task");
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

  logOut() {
    customLog('user-signed-out');
    customLog('user-signed-out');
    customLog('user-signed-out');
    customLog('user-signed-out');
    customLog('user-signed-out');
    this.authService.clearSession();
    this.router.navigate(['/login']);
  }

  onTabChanged(event: any) {
    this.selectedTabIndex = event.index;
    switch (this.selectedTabIndex) {
      case 0: {
        console.log('Case 0: ', this.selectedTabIndex);
        customLog('saved-records-tab-clicked');
        break;
      }
      case 1: {
        console.log('Case 1: ', this.selectedTabIndex);
        customLog('saved-searches-tab-clicked');
        break;
      }
      case 2: {
        console.log('Case 2: ', this.selectedTabIndex);
        customLog('search-history-tab-clicked');
        break;
      }
    }
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
    console.log('-btch called-')
    this.dataService.updateMyFolderSavedRecordsDeleteAll(1);
  }

  editBatchSavedRecordsLabels() {
    this.dataService.updateMyFolderBatchEditLabel(1);
  }

  submitLabel() {
    this.dataService.updatemyFolderBatchEditLabelAddAndRemove({ label: this.newLabel, type: 'add' });
    this.menuBtn.closeMenu()
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
