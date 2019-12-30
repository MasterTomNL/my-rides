import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { Location } from './interfaces/location';

@Injectable()
export class LocationService {
  constructor( private firestore: AngularFirestore, private userService: UserService ) { }

  /** GET locations */
  get () {
    /**return this.firestore
      .collection(this.userService.userId)
      .doc('data')
      .collection('Locations')
      .valueChanges({idField: 'id'});**/

   return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('locations', ref => ref.orderBy('hasPriority', 'desc').orderBy('name'))
      .valueChanges({idField: 'id'});
  }

  /** ADD a location */
  add (location: Location) {
     /**return this.firestore.firestore
      .collection(this.userService.userId)
      .doc('data')
      .collection('Locations')
      .doc(location.id)
      .set(location)
      .then(res => console.log('location added'), err => alert(err));
**/
    return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('locations')
      .doc(location.id)
      .set(location)
      .then(res => console.log('location added'), err => alert(err));
  }

  /** UPDATE a location */
  update (id, location: Location) {
    return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('locations')
      .doc(id)
      .set(location)
      .then(res => console.log('location updated'), err => alert(err));
  }

  /** DELETE a location */
  delete (id) {
    return this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection("locations")
      .doc(id)
      .delete()
      .then(res => console.log('location updated'), err => alert(err));
  }

  import(locations) {
    // Get a new write batch
    const db = this.firestore.firestore;
    var batch = db.batch();

    const locationsCol = this.firestore
      .collection('users')
      .doc(this.userService.userId)
      .collection('locations');

    var i = 0;
    locations.forEach(location => {
      // firestore batches can only be 500 actions
      if (i > 500) {
        batch.commit().then(() => { console.log('batch saved') });
        batch = db.batch();
        i = 0;
      }
      
      batch.set(
        locationsCol.doc(location.id).ref,
        location
      );
      i += 1;
    });

    // Commit the batch
    batch.commit().then(() => { console.log('batch saved') });
  }
}