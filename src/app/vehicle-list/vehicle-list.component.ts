import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from './interfaces/vehicle';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  isAuthenticated = false;
  reloading = false;
  vehicles = [];
  loadStartedAt;
  loadInSeconds;
  savingID = 0;

  constructor(
    private auth: AngularFireAuth,
    private _cdr: ChangeDetectorRef,
    private vehicleService: VehicleService ) {
      this.auth.authState.subscribe(res => {
      if (res)
        this.isAuthenticated = true;
      });
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    if (this.isAuthenticated && !this.reloading)
      this.getVehicles();
    else
      setTimeout(() => this.refresh(), 2500);
  }

  getVehicles(): void {
    this.loadStartedAt = Date.now();
    this.reloading = true;
    this.vehicleService.get()
      .subscribe(result => {
        this.vehicles = result;
        this.reloading = false;
        this.loadInSeconds = (Date.now() - this.loadStartedAt) / 1000;
        setTimeout(() => { this.loadInSeconds = 0; }, 2500);
        this._cdr.detectChanges();
      });
  }

  add(): void {
    this.vehicles.unshift({});
  }

  save(vehicle: Vehicle): void {
    this.savingID = vehicle.id;
    const v = {
      license: vehicle.license,
      make: vehicle.make,
      model: vehicle.model,
      startMeter: vehicle.startMeter,
      startDate: vehicle.startDate,
      hasPriority: vehicle.hasPriority ? true : false,
    };
    if (vehicle.id)
      this.vehicleService
        .update(vehicle.id, v)
        .then(result => {
          console.log('vehicle updated');
          this.savingID = 0;
        }, err => alert(err));
    else
      this.vehicleService
        .add(v)
        .then(result => {
          console.log('vehicle added');
          this.savingID = 0;
        }, err => alert(err));
  }

  delete(id) {
    this.vehicleService
      .delete(this.userId, id)
      .then(result => {
        this.getVehicles();
      }, err => alert(err));
  }

  import() {
    this.vehicleService.import(this.vehicles);
  }
}