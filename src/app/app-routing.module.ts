import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostEditComponent } from './posts/post-edit/post-edit.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from "./auth/auth.guard";
import { AmplifySigninComponent } from './auth/amplify-signin/amplify-signin.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'posts', component: PostListComponent },
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'edit/:postId', component: PostEditComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'amplify-signin', component: AmplifySigninComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
