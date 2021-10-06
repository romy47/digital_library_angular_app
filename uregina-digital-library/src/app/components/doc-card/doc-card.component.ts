import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Doc } from 'src/app/Models';
import { LibraryService } from 'src/app/services';

@Component({
  selector: 'app-doc-card',
  templateUrl: './doc-card.component.html',
  styleUrls: ['./doc-card.component.css']
})
export class DocCardComponent implements OnInit {
  @Input() itemCount: number = null;
  @Input() parent: string = 'serp';
  @Input() doc: Doc;
  @Input() style: string = 'doc-container';
  @Input() searchTerms: string[] = [];
  @Input() searchQuery: string = '';
  @Input() availableLabels = [];
  @Output() saveDoc: EventEmitter<Doc> = new EventEmitter();
  @Output() viewDoc: EventEmitter<{ data: Doc, type: string }> = new EventEmitter();
  @Output() savedDocChecked: EventEmitter<{ data: Doc, selected: boolean }> = new EventEmitter();
  newLabel = '';
  constructor(private libService: LibraryService) { }

  ngOnInit(): void {
    console.log(this.doc);
    this.getUrl();
    if (this.doc.labels && this.doc.labels.length > 0) {
      this.availableLabels = this.availableLabels.filter((el) => !this.doc.labels.includes(el));
    }
  }
  savedDocCheck() {
    this.savedDocChecked.emit({ data: this.doc, selected: true });
  }

  addExistingLabel(label: string) {
    this.libService.addLabelToDoc(label, this.doc._id).subscribe(res => {
      this.doc.labels.push(label);
    });
  }

  submitLabel() {
    this.libService.addLabelToDoc(this.newLabel.trim(), this.doc._id).subscribe(res => {
      this.doc.labels.push(this.newLabel);
    });
  }

  removeLabel(label: string) {
    this.libService.removeLabelFromDoc(label, this.doc._id).subscribe(res => {
      this.doc.labels = this.doc.labels.filter(l => l != label);
    });
  }
  getUrl() {
    if (this.doc.type.toLocaleLowerCase() == 'article') {
      this.libService.getArticleThumbnail(this.doc.doi).subscribe(res => {
        if (res.included && res.included[0] && res.included[0].coverImageUrl) {
          this.doc.imageUrl = res.included[0].coverImageUrl;
        }
      });
    } else if (this.doc.type.toLocaleLowerCase() == 'journal') {
      this.libService.getJournalThumbnail(this.doc.issn).subscribe(res => {
        if (res.data && res.data[0] && res.data[0].coverImageUrl) {
          this.doc.imageUrl = res.data[0].coverImageUrl;
        }
      });
    } else {
      if (this.doc.rawObject.delivery && this.doc.rawObject.delivery.link && this.doc.rawObject.delivery.link.length > 0) {
        this.doc.rawObject.delivery.link.forEach((linkOb, index) => {
          if (linkOb.linkURL) {

            var img = new Image();
            img.src = linkOb.linkURL;
            this.imageExists(linkOb.linkURL, (flag, url, title) => {
              if (flag) {
                this.doc.imageUrl = url;
              } else {
              }
            }, this.doc.title)
          }
        });
      }
    }
  }

  imageExists(url, callback, title) {
    var img = new Image();
    img.onload = function () {
      if (img.width > 1) {
        callback(true, url, title);
      }
    };
    img.onerror = function () { callback(false, url, title); };
    img.src = url;
  }

  addBaselineSavedDoc(doc: any) {
    this.saveDoc.emit(doc);
  }

  // saveToWorkspace(doc: Doc) {
  //   this.saveDoc.emit(doc);
  // }

  viewDocument(doc: Doc) {
    console.log('View Document')
    this.viewDoc.emit({ data: this.doc, type: 'view' });
  }

  openDocument(doc: Doc) {
    console.log('OpenDocument')
    this.viewDoc.emit({ data: this.doc, type: 'open' });
    // this.viewDoc.emit(doc);

  }

}
