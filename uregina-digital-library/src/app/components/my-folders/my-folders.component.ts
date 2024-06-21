import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Doc } from 'src/app/models';
import { Label } from 'src/app/models/Document-Models/label.model';
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
  constructor(private authService: AuthService, private router: Router, private dataService: DataService, private route: ActivatedRoute) { }
  username = '';
  newLabel = '';
  @ViewChild('mtfolderEditLabelBtn') menuBtn: MatMenuTrigger;
  batchEditLabel: { all: Label[], selected: Label[] } = { all: [], selected: [] };

  ngOnInit(): void {
    this.searchQuery = this.route.snapshot.queryParamMap.get('query');
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

  edilAllLabels(data: { all: Label[], selected: Label[] }) {
    this.batchEditLabel = data;
    setTimeout(() => {
      this.menuBtn.openMenu();
    }, 100);
  }

  changeLabel(label: Label, type: string) {
    this.dataService.updatemyFolderBatchEditLabelAddAndRemove({ label: label, type: type });
  }

  logOut() {
    this.authService.clearSession();
    this.router.navigate(['/login']);
  }

  onTabChanged(event: any) {
    this.selectedTabIndex = event.index;
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
    this.dataService.updatemyFolderBatchEditLabelAddAndRemove({ label: new Label({ _id: null, documents: [], title: this.newLabel }), type: 'add' });
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
