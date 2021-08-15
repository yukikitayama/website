import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class DashboardService {
  private dates: string[];
  private datesUpdated = new Subject<string[]>();
  private costs: number[];
  private costsUpdated = new Subject<number[]>();
  private category: string[];
  private count: number[];
  private postData: {value: number, name: string}[];
  private dashboardPostsUpdated = new Subject<{value: number, name: string}[]>();

  constructor(private http: HttpClient) {}

  getCosts() {
    console.log('Getting costs from backend...');
    this.http
      .get<{statusCode: number, body: {dates: string[], costs: number[]}}>(API_URL + '/costs')
      .subscribe(costData => {
        console.log(costData);
        this.dates = costData.body.dates;
        this.datesUpdated.next([...this.dates]);
        this.costs = costData.body.costs;
        this.costsUpdated.next([...this.costs]);
      });
  }

  getDateUpdateListener() {
    return this.datesUpdated.asObservable();
  }

  getCostUpdateListener() {
    return this.costsUpdated.asObservable();
  }

  getPostCountByCategory() {
    this.http
      .get<{message: string, data: {category: string, count: number}[]}>(API_URL + '/dashboard/posts')
      .pipe(
        map((postData) => {
          // console.log(postData);
          return {
            posts: postData.data.map(item => {
              // console.log(item);
              return {
                value: item.count,
                name: item.category
              };
            })
          };
        })
      )
      .subscribe(postData => {
        // console.log(postData.posts);
        this.postData = postData.posts;
        // console.log(this.postData);
        this.dashboardPostsUpdated.next([...this.postData])
      });
  }

  getDashboardPostsUpdateListener() {
    return this.dashboardPostsUpdated.asObservable();
  }
}
