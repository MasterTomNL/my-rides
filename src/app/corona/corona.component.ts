import { Component, OnInit } from '@angular/core';

import { Chart } from 'angular-highcharts';
import { CoronaService } from '../services/corona.service';


@Component({
  selector: 'app-corona',
  templateUrl: './corona.component.html',
  styleUrls: ['./corona.component.css']
})
export class CoronaComponent implements OnInit {
  nice;
  chart;
  deathsAndIc;
  corona = {
    'dates': [],
    'total': [],
    'new': [],
    'delta': [],
    'deaths': [],
    'deathsDelta': [],
    'ic': [],
    'demographic': {
      'recorded': [23,6,30,42,119,322,330,283,282,460,529,602,487,484,562,599,574,426,175,53,24],
      'hospital': [10,1,4,4,5,23,28,20,27,87,115,131,157,226,265,275,233,167,47,3,5],
      'deaths': [0,0,0,0,0,0,0,0,0,0,2,2,7,24,33,70,105,80,23,9,1],
    }
  };

  constructor(private coronaService: CoronaService) { }

  getData() {
    this.getDaily();
  }

  getIC() {
    let beforeMarch = 0;
    this.corona.ic = [];
    this.coronaService.getIC().subscribe((data: any[]) => {
      this.nice = data;
      data.forEach(item => {
        let index = this.corona.dates.indexOf(item.date);
        if (index >= 0)
          this.corona.ic[index] = item.newIntake;
      });
      this.getDeaths();
    });
  }

  getDaily() {
    this.coronaService.getDaily().subscribe(
      data => this.extractData(data, 'total')
    );
  }
  
  getDeaths() {
    this.coronaService.getDeaths().subscribe(
      data => this.extractData(data, 'deaths')
    );
  }

  extractData(res: any, type: string) {
    let allTextLines = res.split(/\r\n|\n/);
    let lines = [];
    let line = {};
    let tmp = [];
    let raw = [];
    let headers = allTextLines[0].split(',');

    allTextLines.forEach((value, index) => {
      tmp = value.split(',');
      line = {};
      if (index > 0 && tmp[0]) {
        let dateIndex = this.corona.dates.indexOf(tmp[0]);
        if (dateIndex < 0) {
          this.corona.dates.push(tmp[0]);
          this.corona[type][this.corona.dates.length-1] = tmp[1];
        }
        else
          this.corona[type][dateIndex] = tmp[1];
      }
    });
   
    if (type == 'total') {
      this.calculateDelta();
      this.getIC();
    } else {
      this.calculateDeathsDelta();
    }
  }
  handleError(err) {
    return err.message;
  }

  calculateDelta() {
    let old;
    // from total to new
    this.corona.total.forEach((value, key) => {
      if (old && value)
        this.corona.new[key] = value - old;
      else
        this.corona.new[key] = 0;
      old = value ? value : old;
    });
    old = 0;
    // from new to delta (new)
    this.corona.new.forEach((value, key) => {
      if (old && value)
        this.corona.delta[key] = value - old;
      else
        this.corona.delta[key] = 0;
      old = value ? value : old;
    });
  }

  calculateDeathsDelta() {
    let old;
    this.corona.deaths.forEach((value, key) => {
      if (old && value)
        this.corona.deathsDelta[key] = value - old;
      else
        this.corona.deathsDelta[key] = 0;
      old = value ? value : old;
    });
    // cleanup the data (for highcharts)
    this.corona.dates.forEach((date, key) => {
      if (this.corona.ic[key] === undefined)
        this.corona.ic[key] = 0;
      if (this.corona.deaths[key] === undefined)
        this.corona.deaths[key] = 0;
      if (this.corona.deathsDelta[key] === undefined)
        this.corona.deathsDelta[key] = 0;
    });
    this.coronaChart();
  }

  coronaChart() {
    this.chart = new Chart({
      chart: { type: 'line' },
      yAxis: { title: { text: ''}},
      xAxis: { categories: this.corona.dates },
      title: { text: 'Corona cases in The Netherlands' },
      credits: { enabled: false },
      series: [
        { name: 'New cases', data: this.corona.new, color: 'black' },
        { name: 'Change in growth', data: this.corona.delta, color: 'orange' }
      ]
    });
    this.deathsAndIc = new Chart({
      chart: { type: 'line' },
      yAxis: { title: { text: ''} },
      xAxis: { categories: this.corona.dates },
      title: { text: 'Corona deaths and IC submissions' },
      credits: { enabled: false },
      series: [
        { name: 'Deaths', data: this.corona.deathsDelta, color: 'red' },
        { name: 'new IC patients', data: this.corona.ic }
      ]
    });
  }

  ngOnInit() {
    this.getData();
/*
    this.demographic = new Chart({
      chart: {
        type: 'bar'
      },
      yAxis: { title: { text: ''}},
      xAxis: { title: { text:'Age' }, categories: [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,'NA']},
      title: {
        text: 'Demographic'
      },
      credits: {
        enabled: false
      },
      series: [
        { name: 'Verified cases', data: this.corona.demographic.recorded, color: 'black' },
        { name: 'Was/Is in hospital', data: this.corona.demographic.hospital, color: 'green' },
        { name: 'Deaths', data: this.corona.demographic.deaths, color: 'red' }
      ]
    });*/

  }

}