import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Post } from './post.model';
import { query } from '@angular/animations';

const API_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class PostsService {
  // posts: Post[] = [
  //   {id: '0', title: 'Title1', category: 'Google Cloud', date: '2021-08-01', content: 'Content1'},
  //   {id: '1', title: 'Title2', category: 'AWS', date: '2021-08-02', content: 'Content2'}
  // ]
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], totalPosts: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    // return [...this.posts];
    const queryParams = `?postsPerPage=${postsPerPage}&currentPage=${currentPage}`;
    console.log('Getting posts from backend...')
    this.http
      // .get<{statusCode: number, body: any}>(API_URL + '/posts')
      .get<{message: string, posts: any, totalPosts: number}>(API_URL + '/posts-proxy' + queryParams)
      .pipe(
        map((postData) => {
          // console.log(postData);
          // return postData.body.posts.map(post => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                title: post.title,
                category: post.category,
                date: post.date,
                content: post.content,
                urlGoogleSlides: post.url_google_slides,
                urlYoutube: post.url_youtube
              };
            }),
            totalPosts: postData.totalPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        // console.log(transformedPosts);
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          totalPosts: transformedPostData.totalPosts});
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return {...this.posts.find(p => p.id === id)};
  }

  updatePost(id: string, title: string, category: string, date: string, content: string) {
    const payload = {
      id: id,
      title: title,
      category: category,
      date: date,
      content: content
    }
    this.http
      .put(API_URL + '/posts', payload)
      .subscribe(response => {
        this.router.navigate(['/posts']);
        // console.log(response);
      });
  }
}
