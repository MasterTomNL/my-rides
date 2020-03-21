import { Component, OnInit } from '@angular/core';

import { Chart } from 'angular-highcharts';


@Component({
  selector: 'app-corona',
  templateUrl: './corona.component.html',
  styleUrls: ['./corona.component.css']
})
export class CoronaComponent implements OnInit {
  chart;
  corona = {
    'new': [6,3,8,6,15,44,46,60,77,56,61,121,111,190,155,176,278,292,346,409,534],
    'deaths': [0,0,0,0,0,0,1,0,2,0,1,1,0,5,2,8,4,19,15,18,30]
  };

  constructor() { }

  ngOnInit() {
    this.chart = new Chart({
      chart: {
        type: 'line'
      },
      xAxis: { categories: [
        'Eerder',
        '01/Mar',
        '02/Mar',
        '03/Mar',
        '04/Mar',
        '05/Mar',
        '06/Mar',
        '07/Mar',
        '08/Mar',
        '09/Mar',
        '10/Mar',
        '11/Mar',
        '12/Mar',
        '13/Mar',
        '14/Mar',
        '15/Mar',
        '16/Mar',
        '17/Mar',
        '18/Mar',
        '19/Mar',
        '20/Mar',
      ]},
      title: {
        text: 'Corona in Nederland'
      },
      credits: {
        enabled: false
      },
      series: [
        { name: 'New cases', data: this.corona.new, color: 'black' },
        { name: 'Deaths', data: this.corona.deaths, color: 'red' }
      ]
    });
  }

}