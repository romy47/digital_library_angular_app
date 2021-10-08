import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AllFacets, Colour, Doc, Facet } from 'src/app/Models';
import { DocumentModelConverter } from 'src/app/Utils/model-converter.util';
import { LibraryService, DataService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { timeout } from 'rxjs/operators';
declare var $: any;
declare var require: any;

@Component({
  selector: 'app-serp',
  templateUrl: './serp.component.html',
  styleUrls: ['./serp.component.css']
})
export class SerpComponent implements OnInit {
  stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"];
  savedDocIds = new Set();
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

  constructor(private libraryService: LibraryService, private authService: AuthService, private sanitizer: DomSanitizer, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.username = this.authService.getCurrentUserData().name;

    const savedDocs: Doc[] = this.route.parent.snapshot.data.savedDocs;
    if (savedDocs && savedDocs.length > 0) {
      savedDocs.forEach(d => {
        this.savedDocIds.add(d.id);
      });
      console.log("saved docs: ", this.savedDocIds);
    }

    this.searchQuery = this.route.snapshot.queryParamMap.get('query');
    console.log(this.searchQuery);
    if (this.searchQuery) {
      this.search(0);
    }
  }

  search(offset = 0) {
    if (this.searching == false) {
      this.searching = true;
      this.documents = [];
      this.libraryService.getSearchResult(this.searchQuery, '', offset).subscribe(res => {
        this.totalDocuments = res.info.total;
        const firstIndex = res.info.first - 1;
        this.currentPage = (firstIndex / this.pageSize) + 1;
        this.searchResult = res;
        this.documents = DocumentModelConverter.formatDocumentModels(res.docs);
        this.documents.forEach(d => {
          if (this.savedDocIds.has(d.id)) {
            d.isSaved = true;
          }
        });
        this.searching = false;

        this.searchTerms = this.searchQuery.split(' ');

        this.searchTerms = this.searchTerms.filter((el) => !this.stopwords.includes(el.toLowerCase()));

        console.log(this.searchTerms);

        this.libraryService.addBaselineSearch(this.searchQuery, this.totalDocuments, (this.totalDocuments < this.pageSize) ? this.totalDocuments : this.pageSize).subscribe(searchResponse => {
          this.searchId = searchResponse._id;

          this.searching = false;
        }, err => {
          this.searching = false;
        });
      }, err => {
        console.log('Error')
      });
    } else {
      console.log('souble tap Serp')
    }
  }

  pageChanged(nextPage: any) {
    this.search((nextPage - 1) * this.pageSize);
  }

  pageBoundsCorrection() {

  }

  saveSearch() {
    this.libraryService.addBaselineSavedSearch(this.searchQuery, this.totalDocuments, (this.totalDocuments < this.pageSize) ? this.totalDocuments : this.pageSize).subscribe(searchResponse => {
      console.log('Search Saved');
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


  viewDocument(input: { data: Doc, type: string }) {
    if (input.type == 'view') {
      input.data.isRead = true;
      input.data.page = this.currentPage;
      this.docViewing = input.data;
      setTimeout(() => {
        $('#serpDocViewModal').modal('show');
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
      }
    }
  }

  closeModal() {
    $('#serpDocViewModal').modal('hide');
  }

  saveToWorkspace(doc: Doc) {
    if (doc.isSaved) {
      doc.isSaved = false;
      this.libraryService.deleteBaselineSavedDoc(doc.id).subscribe(res => {
        this.savedDocIds.delete(doc.id);
      });
    } else {
      doc.isSaved = true;
      this.libraryService.addBaselineSavedDoc(doc).subscribe(res => {
        this.savedDocIds.add(doc.id);
      });
    }

  }

  getLanguage(code: string) {
    return this.langs.where("2", code);
  }

}
