import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-folders',
  templateUrl: './my-folders.component.html',
  styleUrls: ['./my-folders.component.css']
})
export class MyFoldersComponent implements OnInit {
  searchQuery = '';
  constructor() { }

  ngOnInit(): void {
  }

  search() {

  }

}
