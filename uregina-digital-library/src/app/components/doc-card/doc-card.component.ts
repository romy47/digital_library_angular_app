import { Component, Input, OnInit } from '@angular/core';
import { Doc } from 'src/app/Models';

@Component({
  selector: 'app-doc-card',
  templateUrl: './doc-card.component.html',
  styleUrls: ['./doc-card.component.css']
})
export class DocCardComponent implements OnInit {
  @Input() doc: Doc;

  constructor() { }

  ngOnInit(): void {
  }

}
