import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class DashboardService {
  private dates: string[];
  private datesUpdated = new Subject<string[]>();
  private costs: number[];
  private costsUpdated = new Subject<number[]>();

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
}
