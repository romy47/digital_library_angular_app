import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MyFoldersComponent } from './components/my-folders/my-folders.component';
import { SerpComponent } from './components/serp/serp.component';
import { AuthGuard } from './guards/auth.guard';
import { SearchResolver } from './Resolvers/search.resolver'

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'library',
    canActivate: [AuthGuard],
    resolve: {
      savedDocs: SearchResolver
    },
    children: [
      { path: 'search', component: SerpComponent },
      { path: 'my-folder', component: MyFoldersComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'search', pathMatch: 'full', },
    ]
  },
  { path: '', redirectTo: 'library', pathMatch: 'full', },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],

})
export class AppRoutingModule { }
