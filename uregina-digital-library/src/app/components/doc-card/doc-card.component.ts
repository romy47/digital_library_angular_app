import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Doc } from 'src/app/Models';
import { Label } from 'src/app/Models/Document-Models/label.model';
import { LibraryService } from 'src/app/services';
import { customLog } from 'src/app/Utils/log.util';

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
  @Input() mobileSelectEnbaled: boolean = false;
  @Input() searchQuery: string = '';
  @Input() availableLabels = [];
  @Output() saveDoc: EventEmitter<Doc> = new EventEmitter();
  @Output() viewDoc: EventEmitter<{ data: Doc, type: string }> = new EventEmitter();
  // @Output() savedDocChecked: EventEmitter<{ data: Doc, selected: boolean, location: string }> = new EventEmitter();
  @ViewChild('menuTrigger') menuBtn: MatMenuTrigger;

  newLabel = '';
  constructor(private libService: LibraryService) { }

  ngOnInit(): void {
    console.log(this.doc);
    this.getUrl();
    if (this.doc.labelsPopulated && this.doc.labelsPopulated.length > 0) {
      this.availableLabels = this.availableLabels.filter((el) => !this.doc.labelsPopulated.includes(el));
    }
  }
  savedDocCheck(data) {
    console.log('wupwup')
    // this.savedDocChecked.emit({ data: this.doc, selected: true, location: 'doc-card' });
    this.viewDoc.emit({ data: this.doc, type: 'checked' });
  }

  addExistingLabel(label: string) {
    this.libService.addLabelToDoc(label, this.doc._id).subscribe(res => {
      customLog('add-doc-label-existing', label);
      this.doc.labelsPopulated.push(res.data);
    });
  }

  submitLabel() {
    this.libService.addLabelToDoc(this.newLabel.trim(), this.doc._id).subscribe(res => {
      customLog('add-doc-label-new', this.newLabel);
      this.doc.labelsPopulated.push(res.data);
      this.menuBtn.closeMenu();
    });
  }

  removeLabel(label: Label) {
    this.libService.removeLabelFromDoc(label._id, this.doc._id).subscribe(res => {
      customLog('remove-doc-label', label._id);
      this.doc.labelsPopulated = this.doc.labelsPopulated.filter(l => l._id != label._id);
    });
  }
  getUrl() {
    if (this.doc.type.toLocaleLowerCase() == 'article') {
      if (!this.doc.doi) {
        this.doc.doi = (this.doc.rawObject.pnx.addata && this.doc.rawObject.pnx.addata.doi && this.doc.rawObject.pnx.addata.doi[0]) ? this.doc.rawObject.pnx.addata.doi[0] : '';
      }
      this.libService.getArticleThumbnail(this.doc.doi).subscribe(res => {
        if (res.included && res.included[0] && res.included[0].coverImageUrl) {
          this.doc.imageUrl = res.included[0].coverImageUrl;
        }
      });
    } else if (this.doc.type.toLocaleLowerCase() == 'journal') {
      if (!this.doc.issn) {
        this.doc.issn = (this.doc.rawObject.pnx.addata && this.doc.rawObject.pnx.addata.issn && this.doc.rawObject.pnx.addata.issn[0]) ? this.doc.rawObject.pnx.addata.issn[0].replace(/-/g, "") : '';
      }
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
