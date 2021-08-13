import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'Title1', category: 'Google Cloud', date: '2021-08-01', content: 'Content1'},
  //   {title: 'Title2', category: 'AWS', date: '2021-08-02', content: 'Content2'}
  // ]
  posts: Post[];
  isLoading = false;
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;

    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
