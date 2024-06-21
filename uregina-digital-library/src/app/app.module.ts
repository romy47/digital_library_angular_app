import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DefaultPagerComponent, DocCardComponent, DocDetailComponent, LoginComponent, MyFoldersComponent, SavedRecordsComponent, SavedSearchComponent, SearchHistoryComponent, SerpComponent, SignupComponent, TitleHighlightComponent } from './components';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
    HttpClientModule,
    NgxPaginationModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatMenuModule,
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
