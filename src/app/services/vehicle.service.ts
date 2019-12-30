import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { Vehicle } from './interfaces/vehicle';

@Injectable()
export class VehicleService {
  constructor( private firestore: AngularFirestore, private userService: UserService ) { }

  /** GET all vehicles */
  get () {
    /**return this.firestore
      .collection(this.userService.userId)
      .doc('data')
      .collection('Vehicles')
      .valueChanges({idField: 'id'});**/
    
    return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('vehicles', ref => ref.orderBy('make'))
      .valueChanges({idField: 'id'});
  }

  /** ADD a new vehicle */
  add (vehicle: Vehicle) {
    return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('vehicles')
      .add(vehicle)
      .then(res => console.log('vehicle added'), err => alert(err));
  }

  /** UPDATE a vehicle */
  update (id, vehicle: Vehicle) {
    return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('vehicles')
      .doc(id)
      .set(vehicle)
      .then(res => console.log('vehicle updated'), err => alert(err));
  }

  /** DELETE a vehicle */
  delete (id) {
    return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('vehicles')
      .doc(id)
      .delete()
      .then(res => console.log('vehicle deleted'), err => alert(err));
  }

  import(vehicles) {
    // Get a new write batch
    const db = this.firestore.firestore;
    var batch = db.batch();

    const collection = this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('vehicles');

    var i = 0;
    var skipped = 0;
    vehicles.forEach(vehicle => {
      // firestore batches can only be 500 actions
      if (i > 500) {
        batch.commit().then(() => { console.log('batch saved') });
        batch = db.batch();
        i = 0;
      }

      // don't save vehicles without a make, license plate and meter
      if (!vehicle.make || !vehicle.startMeter || !vehicle.license) {
        skipped += 1;
        return;
      }
      
      // add the ride to the batch
      vehicle.startMeter = Number(vehicle.startMeter);
      batch.set(
        collection.doc(vehicle.id).ref,
        vehicle
      );
      i += 1;
    });

    // Commit the batch
    batch.commit().then(() => { console.log('batch saved') });
  }


}