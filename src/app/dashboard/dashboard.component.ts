import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GoogleChartsModule } from 'angular-google-charts';
import { EChartsOption } from 'echarts';

import { DashboardService } from './dashboard.service';
import { Subscription } from 'rxjs';

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
  private datesSub: Subscription;
  private costsSub: Subscription;
  private dashboardPostsSub: Subscription;
  xAxisData = ['2021-08-04', '2021-08-05', '2021-08-06', '2021-08-07', '2021-08-08', '2021-08-09', '2021-08-10'];
  data1 = [0.14, 0.13, 0.1, 0.35, 0.21, 0.18, 0.16];

  constructor(private dashboardService: DashboardService, private http: HttpClient) {}

  ngOnInit(): void {
    // console.log('In dashboard component');
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
    return this.http.get<{statusCode: number, body: {dates: string[], costs: number[]}}>(API_URL + '/costs');
  }

  showCosts() {
    this.getCosts()
      .subscribe((data) => {
        this.costsIsLoading = false;
        this.options = {
          xAxis: {
            type: 'category',
            data: data.body.dates
          },
          yAxis: {
            type: 'value',
            name: 'USD ($)'
          },
          series: [
            {
              data: data.body.costs,
              type: 'bar',
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
          radius: '90%',
          data: postData,
          // data: [
          //   {value: 2, name: 'AWS'},
          //   {value: 1, name: 'Google Cloud'}
          // ],
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
}
