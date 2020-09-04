import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  providers: [
    UserService,
  ]
})
export class AppComponent  {
  authenticated_user;
  error = [];
  googleAuthProvider = new firebase.auth.GoogleAuthProvider();

  constructor (
    private auth: AngularFireAuth,
    private userService: UserService,
  ) {
    this.auth.authState.subscribe(user => {
      if (user)
        this.authenticated_user = user;
    });
  }

  loginGoogle() {
    this.auth.signInWithPopup(this.googleAuthProvider)
      .then(
        (result) => {
          console.log('logged in');
          this.authenticated_user = result.user;
          this.userService.add(this.authenticated_user.uid);
      })
      .catch(
        (err) => {
          this.error = err;
          console.log(err);
      });
  }

  logout() {
    this.auth.auth.signOut().then(function() {
      console.log('succesfully logged out');
    }).catch(function(error) {
      console.log(error);
      console.log('woops... could not log you out');
    });
  }
}
