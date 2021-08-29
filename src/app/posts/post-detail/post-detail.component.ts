import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

import { Post } from '../post.model'
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  // title: string = 'Make API by AWS Lambda and API Gateway';
  // category: string = 'AWS';
  // date: string = '2021-08-23';
  // content: string = '<h2>Idea</h2><p>Hello</p>'
  // urlGoogleSlides: string;
  // post: Post = {
  //   id: '61245b008c67a201c82f0ba7',
  //   title: 'Make API by AWS Lambda and API Gateway',
  //   category: 'AWS',
  //   date: '2021-08-23',
  //   content: '<h2>Idea</h2><p>Hello</p>',
  // };
  post: Post;
  urlYoutube: SafeResourceUrl;
  urlGoogleSlides: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private postsService: PostsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      // console.log(params);
      const id = params['id'];
      this.postsService.getPostByApi(id)
        .subscribe((response) => {
          // console.log(response);
          this.post = response.post;
          // console.log(this.post);
          console.log(this.post.urlYoutube);
          if (this.post.urlYoutube) {
            console.log('Y');
          } else {
            console.log('N');
          }
        });
    });
    let url = 'https://youtube.com/embed/HHBweXs0WIs';
    let urlGoogleSlides = 'https://docs.google.com/presentation/d/e/2PACX-1vT9Je59mRtECCNncUEdjFmA4ahPRXAOxXqtPB37CmO-wpsjJcMRs79IDEIHazdolUmuoWYYm9W0WO6q/embed';
    this.urlYoutube = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.urlGoogleSlides = this.sanitizer.bypassSecurityTrustResourceUrl(urlGoogleSlides);
  }

}
