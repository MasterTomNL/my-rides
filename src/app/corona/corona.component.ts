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
    'new': [6,3,8,6,15,44,46,60,77,56,61,121,111,190,155,176,278,292,346,409,534,637,573,545,811,852],
    'delta': [6,-3,5,-2,9,29,2,14,17,-21,5,60,-10,80,-35,21,102,14,54,63,125,103,-63,-18,266,41],
    'deaths': [0,0,0,0,0,0,1,0,2,0,1,1,0,5,2,8,4,19,15,18,30,30,43,34,63,80],
    'ic': [1,1,0,0,3,1,2,3,5,4,8,6,21,14,17,27,33,35,53,55,86,66,67,99,90,58],
    'demographic': {
      'recorded': [23,6,30,42,119,322,330,283,282,460,529,602,487,484,562,599,574,426,175,53,24],
      'hospital': [10,1,4,4,5,23,28,20,27,87,115,131,157,226,265,275,233,167,47,3,5],
      'deaths': [0,0,0,0,0,0,0,0,0,0,2,2,7,24,33,70,105,80,23,9,1],
    }
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
        '21/Mar',
        '22/Mar',
        '23/Mar',
        '24/Mar',
        '25/Mar',
      ]},
      title: {
        text: 'Corona in The Netherlands'
      },
      credits: {
        enabled: false
      },
      series: [
        { name: 'New cases', data: this.corona.new, color: 'black' },
        { name: 'Change in growth', data: this.corona.delta, color: 'orange' },
        { name: 'Deaths', data: this.corona.deaths, color: 'red' },
        { name: 'new IC patients', data: this.corona.ic }
      ]
    });

    this.demographic = new Chart({
      chart: {
        type: 'bar'
      },
      xAxis: { categories: [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,'NA']},
      title: {
        text: 'Demographic'
      },
      credits: {
        enabled: false
      },
      series: [
        { name: 'Verified cases', data: this.corona.demographic.recorded, color: 'black' },
        { name: 'In hospital', data: this.corona.demographic.hospital, color: 'green' },
        { name: 'Deaths', data: this.corona.demographic.deaths, color: 'red' }
      ]
    });

  }

}