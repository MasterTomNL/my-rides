import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CoronaService {
  icUrl = 'https://stichting-nice.nl/covid-19/public/new-intake/';
  dailyUrl = 'https://raw.githubusercontent.com/J535D165/CoronaWatchNL/master/data/rivm_corona_in_nl_daily.csv';
  deathsUrl = 'https://raw.githubusercontent.com/J535D165/CoronaWatchNL/master/data/rivm_corona_in_nl_fatalities.csv';

  constructor(private http: HttpClient) { }

  getIC() {
    return this.http.get<any>(this.icUrl);
  }
  getDaily() {
    return this.http.get(this.dailyUrl, { responseType: 'text'});
  }
  getDeaths() {
    return this.http.get(this.deathsUrl, { responseType: 'text'});
  }
}