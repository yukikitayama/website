import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  costs;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{statusCode: number, body: any}>(API_URL + '/costs')
      .subscribe(costData => {
        this.costs = costData.body;
        console.log(this.costs);
      });
  }
}
