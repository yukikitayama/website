import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Post } from '../post.model';

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
export class PostTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['title', 'category', 'date'];
  dataSource: MatTableDataSource<Post>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router) {
    // Create array of Post objects
    const posts = Array.from([0, 1], x=> createNewPost(x));
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(posts);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // ?
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  navigateTo(postId: string) {
    this.router.navigate(['/posts-table', postId]);
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
