import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import firebase from 'firebase';
import { User } from "../models/user";
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from "angularfire2";

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {
  private currentUser: User;
  private usersRef = firebase.database().ref('users');

  constructor(public db: AngularFireDatabase) {
  }

  public saveUser(user: User): firebase.Promise<any> {
    this.currentUser = user;
    return this.usersRef.child(user.uid).update(user);
  }

  public getUser(uid: string): FirebaseObjectObservable<any> {
    return this.db.object(this.usersRef.child(uid));
  }

  public addList (userId: string, listId: string): firebase.Promise<any> {
    let updateUserList = {};
    updateUserList[listId] = true;
    return this.usersRef.child(userId).child('lists').update(updateUserList);
  }

  public getUsersByListId(listId) {
    return this.db.list('users', {
      query: {
        orderByChild: `lists/${listId}`,
        equalTo: true
      }
    });
  }

  public searchUsers(name: string): FirebaseListObservable<any[]> {
    name = name.toLowerCase().replace(/\s/g,"");
    return this.db.list('users', {
      query: {
        orderByChild: 'searchname',
        startAt: name,
        endAt: `${name}\uf8ff`,
        limitToFirst: 10
      }
    })
  }

  public serCurrentUser(user: User) {
    this.currentUser = user;
  }

  public getCurrentUser(): User {
    return this.currentUser;
  }
}