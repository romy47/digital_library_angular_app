import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SerpComponent } from './components/serp/serp.component';
import { DocDetailComponent } from './components/doc-detail/doc-detail.component';
import { MyFoldersComponent } from './components/my-folders/my-folders.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DocCardComponent } from './components/doc-card/doc-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    SerpComponent,
    DocDetailComponent,
    MyFoldersComponent,
    DocCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    MatTabsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
