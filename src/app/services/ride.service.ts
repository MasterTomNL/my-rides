import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { Ride } from './interfaces/ride';

@Injectable()
export class RideService {
  constructor( private firestore: AngularFirestore, private userService: UserService ) { }

  /** GET rides */
  get () {
    /**return this.firestore
      .collection(this.userService.userId)
      .doc('data')
      .collection('Rides', ref => {
        return ref.orderBy("date", "desc").orderBy("meter", "desc")
      })
      .valueChanges({idField: 'id'});**/

    return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection("rides", ref => {
        return ref.orderBy("date", "desc").orderBy("meter", "desc")
      })
      .valueChanges({idField: 'id'});
  }

  /** ADD a new ride */
  add (ride: Ride) {
    /**return this.firestore
      .collection(this.userService.userId)
      .doc('data')
      .collection('Rides')
      .add(ride)
      .then(res => console.log('ride added'), err => alert(err));**/
    
    return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('rides')
      .add(ride)
      .then(res => console.log('ride added'), err => alert(err));
  }

  /** UPDATE a ride */
  update (id, ride: Ride) {
    /**return this.firestore
      .collection(this.userService.userId)
      .doc('data')
      .collection('Rides')
      .doc(id)
      .set(ride)
      .then(res => console.log('ride updated'), err => alert(err));**/

    return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('rides')
      .doc(id)
      .set(ride)
      .then(res => console.log('ride updated'), err => alert(err));
  }

  // /** DELETE a ride */
  delete (id) {
    return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('rides')
      .doc(id)
      .delete()
      .then(res => console.log('ride deleted'), err => alert(err));
  }

  import(rides) {
    // Get a new write batch
    const db = this.firestore.firestore;
    var batch = db.batch();

    const ridesCol = this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('rides');

    var i = 0;
    rides.forEach(ride => {
      // firestore batches can only be 500 actions
      if (i > 500) {
        batch.commit().then(() => { console.log('batch saved') });
        batch = db.batch();
        i = 0;
      }
      // don't save rides without a date or meter
      if (!ride.date || !ride.meter)
        return;
      
      // add the ride to the batch
      if (ride.vehicle) {
        delete ride.vehicle;
        delete ride.start;
        delete ride.end;
      }
        
      ride.meter = Number(ride.meter);
      ride.distance = Number(ride.distance);
      batch.set(
        ridesCol.doc(ride.id ? ride.id : ride.date+'_'+ride.meter).ref,
        ride
      );
      i += 1;
    });

    // Commit the batch
    batch.commit().then(() => { console.log('batch saved') });
  }
}