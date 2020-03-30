import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NiceService {
  niceUrl = 'https://stichting-nice.nl/covid-19/public/new-intake/';

  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get<any>(this.niceUrl);
  }
}