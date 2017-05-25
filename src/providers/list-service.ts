import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import firebase from 'firebase';
import { UserService } from "./user-service";

import { Observable } from "rxjs/Observable";
import { FirebaseListObservable, AngularFireDatabase } from "angularfire2";

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ListService {
  private listsRef = firebase.database().ref('lists');

  constructor(public userService: UserService, public db: AngularFireDatabase) {
  }

  public saveList(list: any) {
    var currentUser = this.userService.getCurrentUser();
    list.creator = currentUser.uid;
    list.users = {};
    list.users[currentUser.uid] = true;
    let listId = this.listsRef.push(list).key;
    this.userService.addList(currentUser.uid, listId);
  }

  public getLists() {
    let uid = this.userService.getCurrentUser().uid;
    return this.db.list('lists', {
      query: {
        orderByChild: `users/${uid}`,
        equalTo: true
      }
    });
  }

  public addItem(listId: string, item: any): firebase.database.ThenableReference {
    return this.db.list(this.listsRef.child(listId).child('items')).push(item);
  }

  public getItems(listId: string): FirebaseListObservable<any> {
    return this.db.list(`lists/${listId}/items`);
  }

}
