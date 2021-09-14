import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AllFacets, Colour, Doc, Facet } from 'src/app/Models';
import { DocumentModelConverter } from 'src/app/Utils/model-converter.util';
import { LibraryService, DataService } from 'src/app/services';

@Component({
  selector: 'app-serp',
  templateUrl: './serp.component.html',
  styleUrls: ['./serp.component.css']
})
export class SerpComponent implements OnInit {
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
  documents: Doc[] = null;
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
  savedDocIds = new Set();
  queryParamSubscription: Subscription;
  backToDash = false;
  searching = false;
  constructor(private libraryService: LibraryService) { }

  ngOnInit(): void {
  }

  search(facetedSearchString?: string, offset = 0, newSearch = true) {
    if (this.searching == false) {
      this.searching = true;
      this.documents = null;
      this.libraryService.getSearchResult(this.searchQuery, facetedSearchString, offset).subscribe(res => {
        this.totalDocuments = res.info.total;
        const firstIndex = res.info.first - 1;
        this.currentPage = (firstIndex / 10) + 1;
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



        // if (newSearch) {
        //   this.libraryService.addSearch(this.taskId, this.searchQuery, this.activePagefacetTab, this.selectedNavigationFacets, this.totalDocuments, (this.totalDocuments < this.pageSize) ? this.totalDocuments : this.pageSize).subscribe(searchResponse => {
        //     this.searchId = searchResponse.searches[searchResponse.searches.length - 1]._id;

        //     this.searching = false;
        //   }, err => {
        //     this.searching = false;
        //   });
        // } else {
        //   this.libraryService.updateDocumentBrowsedCount(this.taskId, this.searchId, this.currentPage * this.pageSize).subscribe(res => {
        //     this.searching = false;
        //   }, err => {
        //     this.searching = false;
        //   });
        // }
      }, err => {
        console.log('Error')
      });
    } else {
      console.log('souble tap Serp')
    }
  }

  pageChanged() {

  }

  pageBoundsCorrection() {

  }

}
