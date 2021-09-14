import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyFoldersComponent } from './components/my-folders/my-folders.component';
import { SerpComponent } from './components/serp/serp.component';

const routes: Routes = [
  { path: 'search', component: SerpComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'my-folder', component: MyFoldersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
