import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostEditComponent } from './posts/post-edit/post-edit.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from "./auth/auth.guard";
import { AmplifySigninComponent } from './auth/amplify-signin/amplify-signin.component';
import { PostTableComponent } from './posts/post-table/post-table.component';
import { PostDetailComponent } from './posts/post-detail/post-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'posts', component: PostListComponent },
  { path: 'posts-table', component: PostTableComponent },
  { path: 'posts-table/:id', component: PostDetailComponent },
  { path: 'edit/:postId', component: PostEditComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'amplify-signin', component: AmplifySigninComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
