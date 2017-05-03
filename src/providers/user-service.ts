import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import firebase from 'firebase';
import { User } from "../models/user";

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {
  private usersRef = firebase.database().ref('users');

  constructor() {
  }

  public saveUser(user: User) {
    this.usersRef.child(user.uid).set(user);
  }

}
