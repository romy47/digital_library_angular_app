import { NgModule } from '@angular/core';
import { LoginComponent, MyFoldersComponent, SerpComponent, SignupComponent } from './components';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SearchResolver } from './resolvers/search.resolver'

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'library',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'search',
        component: SerpComponent,
        resolve: {
          savedDocs: SearchResolver
        },
      },
      {
        path: 'my-folder',
        component: MyFoldersComponent,
        resolve: {
          savedDocs: SearchResolver
        },
        canActivate: [AuthGuard]
      },
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
