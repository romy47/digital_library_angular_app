import { Component, Input, OnInit } from '@angular/core';
import { Doc } from 'src/app/Models';

@Component({
  selector: 'app-doc-view-modal',
  templateUrl: './doc-view-modal.component.html',
  styleUrls: ['./doc-view-modal.component.css']
})
export class DocViewModalComponent implements OnInit {
  @Input() docViewing;
  constructor() { }

  ngOnInit(): void {
    console.log('Doc View Modal: ', this.docViewing);
  }

}
