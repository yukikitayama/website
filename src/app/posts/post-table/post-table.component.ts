import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

const TITLES: string[] = [
  'Title1', 'Title2'
];
const CATEGORIES: string[] = [
  'AWS', 'Google Cloud'
]
const DATES: string[] = [
  '2021-07-01', '2021-07-02'
]

const IDS: string[] = [
  '61245b008c67a201c82f0ba7', '6107102eb42867b116feb322'
]

@Component({
  selector: 'app-post-table',
  templateUrl: './post-table.component.html',
  styleUrls: ['./post-table.component.css']
})
export class PostTableComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['title', 'category', 'date'];
  dataSource: MatTableDataSource<Post>;
  isLoading: boolean = false;
  private postsSub: Subscription;
  // Paginator parameters
  totalPosts: number = 0;
  postsPerPage: number = 10;
  currentPage: number = 1;
  pageSizeOptions: number[] = [10, 20, 50];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private postsService: PostsService
  ) {
    // Create array of Post objects
    // const posts = Array.from([0, 1], x=> createNewPost(x));
    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(posts);
    // this.postsService
    //   .getAllPosts()
    //   .subscribe((response) => {
    //     this.dataSource = new MatTableDataSource(response.posts);
    //   });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], totalPosts: number}) => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(postData.posts);
        this.totalPosts = postData.totalPosts;
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // ?
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  navigateTo(postId: string) {
    this.router.navigate(['/posts-table', postId]);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}

// Builds and returns a new Post.
function createNewPost(id: number): Post {
  return {
    id: IDS[id],
    title: TITLES[id],
    category: CATEGORIES[id],
    date: DATES[id],
    content: 'content' + id.toString()
  };
}
