import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RideService } from '../../services/ride.service';
import { Ride } from '../../interfaces/ride';

@Component({
  selector: 'app-ride-edit',
  templateUrl: './ride-edit.component.html',
  styleUrls: ['./ride-edit.component.css'],
  providers: [
    RideService,
  ],
})
export class RideEditComponent {
  userId;
  ride;
  meter;
  vehicles = [];
  locations = [];
  toggleCalc = true;

  constructor(
    public dialogRef: MatDialogRef<RideEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rideService: RideService) {
    this.ride = data.ride;
    this.meter = data.meter;
    this.vehicles = data.vehicles;
    this.locations = data.locations;
    this.userId = data.userId;
  }

  close() {
    this.dialogRef.close(this.ride);
  }

  switch() {
    let startId = this.ride.startId;
    this.ride.startId = this.ride.endId;
    this.ride.endId = startId; 
  }

  save(ride, close) {
    const r: Ride = {
      date: ride.date,
      meter: Number(ride.meter),
      distance: Number(ride.distance),
      isPrivate: ride.isPrivate ? true : false,
      notes: ride.notes ? ride.notes : '',
      vehicleId: ride.vehicleId,
      startId: ride.startId,
      endId: ride.endId,
    };
    if (ride.id) {
      console.log('update a ride');
      ride.saving = true;
      this.rideService
        .update(ride.id, r)
        .then(result => {
          ride.saving = false;
          if (close)
            this.close();
        });
    } else {
      console.log('save a NEW ride');
      this.rideService
        .add(r)
        .then(result => {
          ride.saving = false;
          if (close)
            this.close();
        });
    }
  }

  calcDistance(): void {
    if (this.ride && this.toggleCalc)
      this.ride.distance = Number(this.ride.meter) - Number(this.meter);
  }
  calcMeter(): void {
    if (this.ride && this.toggleCalc)
      this.ride.meter = Number(this.meter) + Number(this.ride.distance);
  }
}