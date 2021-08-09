import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostEditComponent } from './posts/post-edit/post-edit.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'posts', component: PostListComponent },
  { path: 'edit/:postId', component: PostEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
