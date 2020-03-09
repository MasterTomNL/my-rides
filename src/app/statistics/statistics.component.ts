import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import moment from 'moment';

import { RideService } from '../services/ride.service';
import { VehicleService } from '../services/vehicle.service';
import { LocationService } from '../services/location.service';

import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  totalsChart;
  isAuthenticated = false;
  reloading = false;
  rides = [];
  vehicles = [];
  locations = [];
  loadStartedAt;
  loadInSeconds;

  totals = { regular: [0,0,0,0,0,0,0,0,0,0,0,0], private:[0,0,0,0,0,0,0,0,0,0,0,0], total:0, privateLeft:500 };

  constructor(
    private auth: AngularFireAuth,
    private _cdr: ChangeDetectorRef,
    private rideService: RideService,
    private vehicleService: VehicleService,
    private locationService: LocationService) {
      this.auth.authState.subscribe(res => {
      if (res)
        this.isAuthenticated = true;
    });
  }

  ngOnInit() {
    this.refresh();
    //this.drawCharts();
  }

  refresh() {
    if (this.isAuthenticated) {
      if (!this.reloading) {
        this.reloading = true;
        this.loadStartedAt = Date.now();
        this.getLocations();
        this.getVehicles();
        this.getRides();
      }
    } else
      setTimeout(() => this.refresh(), 2500);
  }

  getVehicles(): void {
    this.vehicleService.get().subscribe(result => {
      this.vehicles = result;
    });
  };

  getLocations(): void {
    this.locationService.get().subscribe(result => {
      this.locations = result;
    });
  }

  getRides(): void {
    this.rideService.get().subscribe(result => {
      result.forEach((ride) => {
        ride.vehicle = this.vehicles.find(x => x.id == ride.vehicleId);
        ride.start = this.locations.find(x => x.id == ride.startId);
        ride.end = this.locations.find(x => x.id == ride.endId);
        let date = moment(ride.date, 'YYYY-MM-DD');
        if (date.year() == moment().year()) {
          if (ride.isPrivate) {
            this.totals.private[ date.month() ] += Number(ride.distance);
            this.totals.privateLeft -= Number(ride.distance);
          }
          else
            this.totals.regular[ date.month() ] += Number(ride.distance);
        }
        this.totals.total += Number(ride.distance);
      });
      this.rides = result;
      this.reloading = false;
      this.loadInSeconds = (Date.now() - this.loadStartedAt) / 1000;
      setTimeout(() => { this.loadInSeconds = 0; }, 2500);
      this._cdr.detectChanges();
      this.drawCharts();
    });
  }


  drawCharts() {
    this.drawTotals();
  }
  drawTotals() {
    this.totalsChart = new Chart({
      chart: {
        type: 'column'
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      title: {
        text: 'Private vs Normal'
      },
      credits: {
        enabled: false
      },
      series: [
        { name: 'Private', data: this.totals.private },
        { name: 'Regular', data: this.totals.regular }
      ]
    });
  }
}