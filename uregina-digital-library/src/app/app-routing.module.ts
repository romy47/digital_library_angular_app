import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MyFoldersComponent } from './components/my-folders/my-folders.component';
import { SerpComponent } from './components/serp/serp.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'search', component: SerpComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/search', pathMatch: 'full', },
  { path: 'my-folder', component: MyFoldersComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],

})
export class AppRoutingModule { }
