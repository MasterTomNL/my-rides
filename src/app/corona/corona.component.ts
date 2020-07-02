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
  chartNewDelta;
  chartDeathsIc;
  chartDemographics;
  corona = {
    'dates': [],
    'total': [],
    'new': [],
    'delta': [],
    'deaths': [],
    'deathsDelta': [],
    'deathsDates': [],
    'ic': [],
    'demographics': {
      'categories': [],
      'deaths': [],
      'hospital': [],
      'cases': [] 
    }
  };

  constructor(private coronaService: CoronaService) { }

  ngOnInit() {
    this.getDaily();
  }

  getDaily() {
    this.coronaService.getDaily().subscribe(
      data => {
        this.extractData(data);
        this.calculateDelta();
        this.getDeaths();
      }
    );
  }
  
  getDeaths() {
    this.coronaService.getDeaths().subscribe(
      data => {
        this.extractDeathsData(data);
        this.calculateDeathsDelta();
        this.getDemographics();
      }
    );
  }

  getDemographics() {
    this.coronaService.getDemographics().subscribe(
      data => {
        this.extractDemographics(data);
        this.getIC();
      }
    );
  }

  getIC() {
    let beforeMarch = 0;
    this.corona.ic = [];
    this.coronaService.getIC().subscribe((data: any[]) => {
      console.log(data);
      data[0].forEach(item => {
        let index = this.corona.deathsDates.indexOf(item.date);
        if (index >= 0)
          this.corona.ic[index] = item.value;
      });
      this.cleanup();
      this.createCharts();
    });
  }

  toArray(res: any) {
    let lines = res.split(/\r\n|\n/);
    let arr = [];
    lines.forEach((line, index) => {
      if (index > 0) {
        arr.push(line.split(','));
      }
    });
    return arr;
  }

  extractData(res: any) {
    let data = this.toArray(res);
    let raw = [];
    let tmp;
    
    data.forEach(line => {
      let dateIndex = this.corona.dates.indexOf(line[0]);
      if (dateIndex < 0) {
        this.corona.dates.push(line[0]);
        this.corona.total[this.corona.dates.length-1] = line[1];
      }
      else
        this.corona.total[dateIndex] = line[1];
    });
  }

  extractDeathsData(res: any) {
    let data = this.toArray(res);
    let raw = [];
    let tmp;
    
    data.forEach(line => {
      let dateIndex = this.corona.deathsDates.indexOf(line[0]);
      if (dateIndex < 0) {
        this.corona.deathsDates.push(line[0]);
        this.corona.deaths[this.corona.deathsDates.length-1] = line[1];
      }
      else
        this.corona.deaths[dateIndex] = line[1];
    });
  }

  extractDemographics(res: any) {
    let data = this.toArray(res);
    let ageIndex;
    // 0: date
    // 1: age
    // 2: type (Overleden/Totaal/Ziekenhuisopname)
    // 3: aantal
    let categories = {
      'Overleden': 'deaths',
      'Totaal': 'cases',
      'Ziekenhuisopname': 'hospital'
    }

    data.forEach(arr => {
      ageIndex = this.corona.demographics.categories.indexOf(arr[1])
      if (ageIndex < 0) {
        if (arr.length == 4) {
          this.corona.demographics.categories.push(arr[1]);
          this.corona.demographics[categories[arr[2]]].push(parseInt(arr[3]));
        }
      } else {
        if (!this.corona.demographics[categories[arr[2]]][ageIndex])
          this.corona.demographics[categories[arr[2]]][ageIndex] = parseInt(arr[3]);
        else
          this.corona.demographics[categories[arr[2]]][ageIndex] += parseInt(arr[3]);
      }
    });
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
  }

  cleanup() {
    // cleanup the data (for highcharts)
    this.corona.deathsDates.forEach((date, key) => {
      if (this.corona.ic[key] === undefined)
        this.corona.ic[key] = 0;
      if (this.corona.deaths[key] === undefined)
        this.corona.deaths[key] = 0;
      if (this.corona.deathsDelta[key] === undefined)
        this.corona.deathsDelta[key] = 0;
    });
    this.corona.dates.pop();
    this.corona.new.pop();
    this.corona.delta.pop();
    this.corona.ic.pop();
    this.corona.deaths.pop();
    this.corona.deathsDelta.pop();
  }

  createCharts() {
    // new and delta
    this.chartNewDelta = new Chart({
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
    // deaths and IC
    this.chartDeathsIc = new Chart({
      chart: { type: 'line' },
      yAxis: { title: { text: ''} },
      xAxis: { categories: this.corona.deathsDates },
      title: { text: 'Corona deaths and IC submissions' },
      credits: { enabled: false },
      series: [
        { name: 'Deaths', data: this.corona.deathsDelta, color: 'red' },
        { name: 'new IC patients', data: this.corona.ic }
      ]
    });
    // demographics
    this.chartDemographics = new Chart({
      chart: { type: 'bar' },
      yAxis: { title: { text: ''}},
      xAxis: {
        title: { text:'Age' },
        categories: this.corona.demographics.categories
      },
      title: { text: 'Demographic' },
      credits: { enabled: false },
      series: [
        { name: 'Verified cases', data: this.corona.demographics.cases, color: 'black' },
        { name: 'Was/Is in hospital', data: this.corona.demographics.hospital, color: 'green' },
        { name: 'Deaths', data: this.corona.demographics.deaths, color: 'red' }
      ]
    });
  }
}