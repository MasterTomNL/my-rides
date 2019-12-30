import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userId: string;

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth) {
      this.auth.authState.subscribe(user => {
        if (user)
          this.userId = user.uid;
      });
  }

  /** create the user collection/document */
  add (id) {
    console.log('create a collection/document for ' + id);
    return this.firestore
      .collection('users')
      .doc(id)
      .set({'userId': id, 'last_login': new Date})
      .then(res => console.log('user added'), err => alert(err));
  }
}