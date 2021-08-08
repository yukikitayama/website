import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Post } from './post.model';

const API_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class PostsService {
  // posts: Post[] = [
  //   {id: '0', title: 'Title1', category: 'Google Cloud', date: '2021-08-01', content: 'Content1'},
  //   {id: '1', title: 'Title2', category: 'AWS', date: '2021-08-02', content: 'Content2'}
  // ]
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    // return [...this.posts];
    this.http
      .get<{statusCode: number, body: any}>(API_URL + '/posts')
      .pipe(map((postData) => {
        // console.log(postData);
        return postData.body.posts.map(post => {
          return {
            id: post._id,
            title: post.title,
            category: post.category,
            date: post.date,
            content: post.content
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

}
