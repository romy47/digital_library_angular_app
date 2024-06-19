import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AllFacets, Colour, Doc, Facet } from 'src/app/Models';
import { DocumentModelConverter } from 'src/app/Utils/model-converter.util';
import { LibraryService, DataService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { customLog } from 'src/app/Utils/log.util';
import { DOCUMENT, Location } from "@angular/common";
import { Label } from 'src/app/Models/Document-Models/label.model';
declare var $: any;
declare var require: any;

@Component({
  selector: 'app-serp',
  templateUrl: './serp.component.html',
  styleUrls: ['./serp.component.css']
})
export class SerpComponent implements OnInit {
  @ViewChild('EditLabelBtn') menuBtn: MatMenuTrigger;
  stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"];
  taskEmpty = false;
  docViewing: Doc;
  interestedDocuments: Doc[] = [];
  searchQuery = '';
  searchTerms: string[] = [];
  pageFacets: Facet[] = [];
  // tslint:disable-next-line:max-line-length
  navigationFacets: AllFacets = new AllFacets({ topics: [], contributors: [], categories: [], resourceTypes: [], journalTitles: [], languages: [], creationDate: [] });
  // tslint:disable-next-line:max-line-length
  selectedNavigationFacets: AllFacets = new AllFacets({ topics: [], contributors: [], categories: [], resourceTypes: [], journalTitles: [], languages: [], creationDate: [] });
  documents: Doc[] = [];
  focusedDocIndex = 0;
  activePagefacetTab = 'Subject';
  // This has to be done properly
  searchResult: any;
  popupMenuFacet: Facet = new Facet({ text: '', count: 0 });
  minValue = 1900;
  maxValue = 2021;
  taskId = '';
  searchId = '';
  totalDocuments = 0;
  pageSize = 10;
  currentPage = 1;
  prevSearchQuery: string[] = [];
  queryParamSubscription: Subscription;
  backToDash = false;
  searching = false;
  username = "";
  allDocSelected = false;
  saveSearchMessageVisible = false;
  docUrl: SafeResourceUrl;
  langs = require('langs');
  docCheckCount = 0;
  mobileSelectEnbaled = false;
  newLabel = '';
  allDocLabels: Label[] = [];
  searchFromFormSubmit = false;
  onInit = true;
  savedDocs: Doc[] = [];
  constructor(private router: Router, private libraryService: LibraryService, private authService: AuthService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    customLog('serp-reached');

    this.username = this.authService.getCurrentUserData().name;

    this.savedDocs = this.route.snapshot.data.savedDocs;

    // console.log('**** ****** ***** ****** ***** ***** ***** ****** ***** ****', savedDocs);
    this.allDocLabels = [];
    if (this.savedDocs && this.savedDocs.length > 0) {
      this.savedDocs.forEach(d => {
        d.labelsPopulated.forEach(l => {
          const label = this.allDocLabels.find(label => label._id = l._id);
          if (label == null) {
            this.allDocLabels.push(l)
          }
        });
      });
    }

    this.searchQuery = this.route.snapshot.queryParamMap.get('query');
    console.log(this.searchQuery);
    // if (this.searchQuery && this.searchQuery.trim().length > 0) {
    //   customLog('my-folder-to-serp-query', this.searchQuery, '');
    //   console.log('~~~~~~~~~~~~~~~~~~~~~ Searchimg From: On Init');
    //   this.search(0, false);
    // }

    this.route.queryParams.subscribe(p => {
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', this.searchFromFormSubmit);
      this.searchQuery = this.route.snapshot.queryParamMap.get('query');
      if (this.searchFromFormSubmit) {
        this.searchFromFormSubmit = false;
      } else {
        console.log('~~~~~~~~~~~~~~~~~~~~~ Searchimg From: Query Subscription');
        this.search(0, false);
      }
    });

    this.location.subscribe(location => {

      if ($('#serpDocViewModal').hasClass('show')) {
        console.log('Back Pressed ^^^^^^^^^^^^^^^^^^^^^^^^^^^')
        this.closeModal();
        // event.preventDefault();
        // //  this.location.go(state.url);

        // window.history.pushState(null, "", window.location.href);
        // window.onpopstate = function () {
        //   window.history.pushState(null, "", window.location.href);
        // };
      }
    });
  }

  startTask() {
    customLog("start-session2-task");
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

  changeLabel(label: Label, type: string) {
    let selecteDocs = this.documents.filter(d => d.selected == true);
    console.log('tEST X1', this.documents);
    // selecteDocs.forEach(d => {
    //   d.labelsPopulated.push(label);
    // })
    customLog('batch-save-doc-with-label', 'Label: ' + label + ', size: ' + selecteDocs.length.toString())
    this.libraryService.addBatchBaselineSavedDoc(selecteDocs, label).subscribe(res => {
      this.documents.filter(d => d.selected == true).forEach(doc => {
        doc.isSaved = true;
      });
    });
  }

  submitLabel() {
    this.changeLabel(new Label({ title: this.newLabel, documents: [], _id: null }), 'add');
    this.menuBtn.closeMenu()
  }


  toggleMobileSelect() {
    this.mobileSelectEnbaled = !this.mobileSelectEnbaled;
  }

  saveBatch() {
    this.menuBtn.openMenu();
    // let selecteDocs = this.documents.filter(d => d.selected == true);
    // this.libraryService.addBatchBaselineSavedDoc(selecteDocs).subscribe(res => {
    //   this.documents.filter(d => d.selected == true).forEach(doc => {
    //     doc.isSaved = true;
    //   });;
    // })
  }

  search(offset = 0, fromSubmit = true) {
    if (this.searching == false && this.searchQuery && this.searchQuery.trim().length > 0) {
      this.searching = true;
      this.documents = [];
      this.libraryService.getSearchResult(this.searchQuery, '', offset).subscribe(res => {
        this.totalDocuments = res.data.info.total;
        const firstIndex = res.data.info.first - 1;
        this.currentPage = (firstIndex / this.pageSize) + 1;
        this.searchResult = res;
        this.documents = DocumentModelConverter.formatDocumentModels(res.data.docs);
        this.documents.forEach(d => {
          const doc = this.savedDocs.find(doc => doc.id === d.id);
          if (doc) {
            console.log('Found');
            d.isSaved = true;
            d._id = doc._id;
          } else {
            console.log('Not Found');
          }
        });
        this.searching = false;

        this.searchTerms = this.searchQuery.split(' ');

        this.searchTerms = this.searchTerms.filter((el) => !this.stopwords.includes(el.toLowerCase()));

        console.log(this.searchTerms);

        // this.libraryService.addBaselineSearch(this.searchQuery, this.totalDocuments, (this.totalDocuments < this.pageSize) ? this.totalDocuments : this.pageSize).subscribe(searchResponse => {
        this.searchId = res.data._id;

        this.searching = false;

        const queryParams: Params = { query: this.searchQuery };
        if (fromSubmit) {
          console.log('$$$$$$$$$$$$$$$$$$$$ $$$$$$$$$$$$$ $$$$ $');
          this.searchFromFormSubmit = true;
          this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParams: queryParams,
              queryParamsHandling: 'merge', // remove to replace all query params by provided
            });

        }
        // }, err => {
        //   this.searching = false;
        // });
      }, err => {
        console.log('Error')
      });
    } else {
      console.log('souble tap Serp')
    }
  }

  pageChanged(nextPage: any) {
    customLog('serp-paging', (nextPage - 1).toString());
    this.search((nextPage - 1) * this.pageSize);
  }

  pageBoundsCorrection() {

  }

  saveSearch() {
    this.libraryService.addBaselineSavedSearch(this.searchQuery, this.totalDocuments, (this.totalDocuments < this.pageSize) ? this.totalDocuments : this.pageSize).subscribe(searchResponse => {
      customLog('save-search-from-serp', this.searchQuery);
      this.showSaveSearchMessage();
    });
  }

  showSaveSearchMessage() {
    this.saveSearchMessageVisible = true;
    setTimeout(() => {
      this.saveSearchMessageVisible = false;
    }, 8000);
  }

  // openDoc(doc: Doc) {
  //   console.log(doc)
  //   if (doc.rawObject.delivery && doc.rawObject.delivery.GetIt1 && doc.rawObject.delivery.GetIt1.length > 0 && doc.rawObject.delivery.GetIt1[0].links && doc.rawObject.delivery.GetIt1[0].links.length > 0 && doc.rawObject.delivery.GetIt1[0].links[0].link) {
  //     let url = doc.rawObject.delivery.GetIt1[0].links[0].link;
  //     let sbDomain = 'casls-regina.userservices.exlibrisgroup.com/view/uresolver/01CASLS_REGINA/openurl';
  //     var pattern = /1.1.1.1+/g;
  //     url = url.replace(pattern, sbDomain);
  //     console.log(url)
  //     window.open(url, '_blanc');
  //   }
  // }

  allSavedSearchChecked(data: any) {
    if (this.allDocSelected) {
      this.documents.forEach(d => {
        d.selected = true;
      });
    } else {
      this.documents.forEach(d => {
        d.selected = false;
      });
    }
  }

  viewDocument(input: { data: Doc, type: string }) {
    if (input.type == 'checked') {
      this.docCheckCount = this.documents.filter(d => d.selected == true).length;
    }
    else if (input.type == 'view') {
      input.data.page = this.currentPage;
      // Object.assign(this.docViewing, input.data);
      this.docViewing = input.data;
      console.log(this.docViewing);
      setTimeout(() => {
        $('#serpDocViewModal').modal('show');
        customLog('view-doc', this.docViewing.title, this.docViewing.id);

      }, 200)
    } else {
      let doc = input.data;
      if (doc.rawObject.delivery && doc.rawObject.delivery.GetIt1 && doc.rawObject.delivery.GetIt1.length > 0 && doc.rawObject.delivery.GetIt1[0].links && doc.rawObject.delivery.GetIt1[0].links.length > 0 && doc.rawObject.delivery.GetIt1[0].links[0].link) {
        let url = doc.rawObject.delivery.GetIt1[0].links[0].link;
        let sbDomain = 'casls-regina.userservices.exlibrisgroup.com/view/uresolver/01CASLS_REGINA/openurl';
        var pattern = /1.1.1.1+/g;
        url = url.replace(pattern, sbDomain);
        console.log(url)
        window.open(url, '_blanc');
        customLog('get-doc', doc.title, doc.id);
      }
    }
  }

  // savedDocChecked(data: { data: Doc, selected: boolean }) {
  //   console.log('checked')
  //   this.docCheckCount = this.documents.filter(d => d.selected == true).length;
  // }

  closeModal() {
    $('#serpDocViewModal').modal('hide');
    customLog('doc-view-modal-close-clicked');
  }

  saveToWorkspace(doc: Doc) {
    if (doc.isSaved) {
      this.libraryService.deleteBaselineSavedDoc(doc._id).subscribe(res => {
        doc.isSaved = false;
        this.savedDocs = this.savedDocs.filter(d => d._id != doc._id);
        doc._id = null;
        customLog('removed-saved-document', doc.title, doc.id);
      });
    } else {
      this.libraryService.addBaselineSavedDoc(doc).subscribe(res => {
        doc.isSaved = true;
        this.savedDocs.push(new Doc(res.data));
        doc._id = res.data._id
        customLog('saved-document', doc.title, doc.id);
      });
    }

  }

  getLanguage(code: string) {
    return this.langs.where("2", code);
  }

}
