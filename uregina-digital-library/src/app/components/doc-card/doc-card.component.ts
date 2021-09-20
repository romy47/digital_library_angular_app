import { Component, Input, OnInit } from '@angular/core';
import { Doc } from 'src/app/Models';
import { LibraryService } from 'src/app/services';

@Component({
  selector: 'app-doc-card',
  templateUrl: './doc-card.component.html',
  styleUrls: ['./doc-card.component.css']
})
export class DocCardComponent implements OnInit {
  @Input() doc: Doc;
  @Input() searchTerms: string[];
  @Input() searchQuery: string = '';
  constructor(private libService: LibraryService) { }

  ngOnInit(): void {
    console.log(this.doc);
    this.getUrl();
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

}
