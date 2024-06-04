import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SerpComponent } from './components/serp/serp.component';
import { DocDetailComponent } from './components/doc-detail/doc-detail.component';
import { MyFoldersComponent } from './components/my-folders/my-folders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DocCardComponent } from './components/doc-card/doc-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { SearchHistoryComponent } from './components/search-history/search-history.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SavedSearchComponent } from './components/saved-search/saved-search.component';
import { TitleHighlightComponent } from './components/title-highlight/title-highlight';
import { DefaultPagerComponent } from './components/default-pager/default-pager.component';
import { SavedRecordsComponent } from './components/saved-records/saved-records.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SignupComponent } from './components/signup/signup.component';
import { AuthInterceptor } from './interceptors/auth.intercepter';
@NgModule({
  declarations: [
    AppComponent,
    SerpComponent,
    DocDetailComponent,
    MyFoldersComponent,
    DocCardComponent,
    LoginComponent,
    SearchHistoryComponent,
    SavedSearchComponent,
    TitleHighlightComponent,
    DefaultPagerComponent,
    SavedRecordsComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatMenuModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
