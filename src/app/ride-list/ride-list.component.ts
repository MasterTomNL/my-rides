import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import moment from 'moment';

import { Ride } from '../interfaces/ride';
import { RideService } from '../services/ride.service';
import { VehicleService } from '../services/vehicle.service';
import { LocationService } from '../services/location.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RideEditComponent } from './ride-edit/ride-edit.component';
import { formatDate } from "@angular/common";

import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
registerLocaleData(localeNl, 'nl');

import * as XLSX from 'xlsx';


@Component({
  selector: 'app-ride-list',
  templateUrl: './ride-list.component.html',
  styleUrls: ['./ride-list.component.css'],
})
export class RideListComponent implements OnInit {
  isAuthenticated = false;
  reloading = false;
  rides = [];
  vehicles = [];
  locations = [];
  loadStartedAt;
  loadInSeconds;
  filterVehicle = null;
  filterPrivate = false;
  privateLimit = 0;

  totals = { regular:0, private:0 };

  constructor(
    private auth: AngularFireAuth,
    private _cdr: ChangeDetectorRef,
    private rideService: RideService,
    private vehicleService: VehicleService,
    private locationService: LocationService,
    private matDialog: MatDialog) {
      this.auth.authState.subscribe(res => {
      if (res)
        this.isAuthenticated = true;
    });
  }

  ngOnInit() {
    this.refresh();
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

  add(): void {
    const lastRide = this.rides.length > 0 ? Object.assign({}, this.rides[0]): {};
    let ride = {
      date: formatDate(new Date(), 'yyyy-MM-dd', 'en-GB'),
      startId: lastRide.endId,
      endId: lastRide.startId,
      vehicleId: lastRide.vehicleId,
      meter: lastRide.meter,
    };
    this.edit(ride, null);
  }

  getVehicles(): void {
    this.vehicleService.get().subscribe(result => {
      this.vehicles = result;
      this.filterVehicle = this.vehicles[0];
    });
  };

  getLocations(): void {
    this.locationService.get().subscribe(result => {
      this.locations = result;
    });
  }

  getRides(): void {
    this.privateLimit = Math.round((moment().month() + 1) * (500 / 12));
    this.rideService.get().subscribe(result => {
      this.totals.private = 0;
      this.totals.regular = 0;
      result.forEach((ride) => {
        ride.vehicle = this.vehicles.find(x => x.id == ride.vehicleId);
        ride.start = this.locations.find(x => x.id == ride.startId);
        ride.end = this.locations.find(x => x.id == ride.endId);

        // collecting some stats
        let date = moment(ride.date, 'YYYY-MM-DD');
        if (date.year() == moment().year()) {
          if (ride.isPrivate)
            this.totals.private += Number(ride.distance);
          else
            this.totals.regular += Number(ride.distance);
        }
      });
      this.rides = result;
      this.reloading = false;
      this.loadInSeconds = (Date.now() - this.loadStartedAt) / 1000;
      setTimeout(() => { this.loadInSeconds = 0; }, 2500);
      this._cdr.detectChanges();
    });
  }
  
  edit(ride, i) {
    const dialogConfig = new MatDialogConfig();
    const lastMeter = i !== null && this.rides[i+1] ? this.rides[i+1].meter : ride.meter;
    dialogConfig.data = {
      ride: Object.assign({}, ride),
      meter: lastMeter,
      vehicles: this.vehicles,
      locations: this.locations
    };
    let dialogRef = this.matDialog.open(RideEditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.getRides();
    });
  }

  export() {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rides);
    XLSX.utils.book_append_sheet(wb, ws, 'Rides');

    ws = XLSX.utils.json_to_sheet(this.vehicles);
    XLSX.utils.book_append_sheet(wb, ws, 'Vehicles');

    ws = XLSX.utils.json_to_sheet(this.locations);
    XLSX.utils.book_append_sheet(wb, ws, 'Locations');

    XLSX.writeFile(wb, 'Rides.xls');
  }

  import() {
    this.rideService.import(this.rides);
  }
}