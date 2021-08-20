import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { GoogleChartsModule } from 'angular-google-charts';
import { EChartsOption } from 'echarts';

import { DashboardService } from './dashboard.service';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  options: any;
  optionsPostsPieChart: any;
  dates: string[];
  costs: number[];
  costsIsLoading = false;
  postsIsLoading = false;
  startDate: FormControl;
  endDate: FormControl;
  private datesSub: Subscription;
  private costsSub: Subscription;
  private dashboardPostsSub: Subscription;

  constructor(private dashboardService: DashboardService, private http: HttpClient) {}

  ngOnInit(): void {
    // console.log('In dashboard component');

    // Set default dates for cost chart
    let startDate = new Date();
    let pastDate = startDate.getDate() - 8 * 2;
    startDate.setDate(pastDate);
    this.startDate = new FormControl(startDate);
    let endDate = new Date();
    pastDate = endDate.getDate() - 1;
    endDate.setDate(pastDate);
    this.endDate = new FormControl(endDate);

    this.costsIsLoading = true;
    this.showCosts();

    // this.dashboardService.getCosts();
    // this.datesSub = this.dashboardService.getDateUpdateListener()
    //   .subscribe((dates: string[]) => {
    //     this.dates = dates;
    //     console.log('dates: ' + this.dates);
    //     this.options.xAxis.data = this.dates;
    //   });
    // this.costsSub = this.dashboardService.getCostUpdateListener()
    //   .subscribe((costs: number[]) => {
    //     this.costs = costs;
    //     console.log('costs: ' + this.costs);
    //     this.options.series[0].data = this.costs;
    //   });

    this.postsIsLoading = true;
    this.dashboardService.getPostCountByCategory();
    this.dashboardPostsSub = this.dashboardService.getDashboardPostsUpdateListener()
      .subscribe((postData: {value: number, name: string}[]) => {
        this.postsIsLoading = false;
        this.setOptionsPostsPieChart(postData);
      });
  }

  getCosts() {
    let startDateParam = this.startDate.value.toISOString().split('T')[0];
    let endDateParam = this.endDate.value.toISOString().split('T')[0];
    // return this.http.get<{statusCode: number, body: {dates: string[], costs: number[]}}>(API_URL + '/costs');
    return this.http
      .get<{dates: string[], costs: number[]}>(API_URL + `/costs-proxy?startDate=${startDateParam}&endDate=${endDateParam}`);
  }

  showCosts() {
    this.getCosts()
      .subscribe((data) => {
        this.costsIsLoading = false;
        this.options = {
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.dates
          },
          yAxis: {
            type: 'value',
            name: 'USD ($)'
          },
          series: [
            {
              data: data.costs,
              type: 'line',
              areaStyle: {}
            }
          ],
          tooltip: {
            trigger: 'item'
          }
        };
      });
  }

  setOptionsPostsPieChart(postData: {value: number, name: string}[]) {
    this.optionsPostsPieChart = {
      // title: {
        // text: 'Number of posts by category',
        // left: 'center'
      // },
      tooltip: {
        trigger: 'item'
      },
      // legend: {
        // orient: 'vertical',
        // left: 'left'
      // },
      series: [
        {
          type: 'pie',
          radius: '70%',
          data: postData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  setStartDate(event: MatDatepickerInputEvent<Date>) {
    // console.log(event);
    this.startDate.setValue(event.value);
    // console.log(this.startDate);
  }

  setEndDate(event: MatDatepickerInputEvent<Date>) {
    // console.log(event);
    this.endDate.setValue(event.value);
    // console.log(this.endDate);
  }
}
