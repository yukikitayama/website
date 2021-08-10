import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
  post: Post;
  form: FormGroup;
  isLoading = false;
  private postId: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    // this.form = new FormGroup({
    //   title: new FormControl(null, {validators: [Validators.required]}),
    //   category: new FormControl(null, {validators: [Validators.required]}),
    //   date: new FormControl(null, {validators: [Validators.required]}),
    //   content: new FormControl(null, {validators: [Validators.required]})
    // });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.post = this.postsService.getPost(this.postId);
        this.isLoading = false;
        // console.log(this.post);
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.postsService.updatePost(
      this.postId,
      form.value.title,
      form.value.category,
      form.value.date,
      form.value.content);
  }
}
