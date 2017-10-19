import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import firebase from 'firebase';
import { UserService } from "./user-service";

import { Observable } from "rxjs/Observable";
import { FirebaseListObservable, AngularFireDatabase } from "angularfire2/database";

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ListService {
  private listsRef = firebase.database().ref('lists');
  private itemsListsRef = firebase.database().ref('itemsLists');

  constructor(public userService: UserService, public db: AngularFireDatabase) {
  }

  public saveList(list: any, listId: any): firebase.Promise<any> {
    let updates = {};
    updates['/lists/' + listId] = list;
    updates['/users/' + this.userService.getCurrentUser().uid + '/lists/' + listId] = true;
    return firebase.database().ref().update(updates);
  }

  public editList(key:string, editList: any): firebase.Promise<any> {
    return this.listsRef.child(key).update(editList);
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
    item.price = 0;
    item.done = false;
    return this.db.list(this.itemsListsRef.child(listId)).push(item);
  }

  public getItems(listId: string): FirebaseListObservable<any> {
    return this.db.list(`itemsLists/${listId}`);
  }

  public getUsers(listId: string): FirebaseListObservable<any> {
    return this.userService.getUsersByListId(listId);
  }

  public setPrice(listId: string, item: any, price: number): firebase.Promise<any> {
    let updateItem = {
      'done': item.done,
      'price': price
    };
    return this.itemsListsRef.child(`${listId}/${item.$key}`).update(updateItem);
  }

  public deleteItem(listId: string, itemId: string): firebase.Promise<any> {
    return this.itemsListsRef.child(`${listId}/${itemId}`).remove();
  }

  public addUser (listId:string, userId:string): firebase.Promise<any> {
    var updates = {};
    updates[`lists/${listId}/users/${userId}`] = true;
    updates[`users/${userId}/lists/${listId}`] = true;
    return firebase.database().ref().update(updates);
  }

  public setUserAdmin (listId: string, userId: string): firebase.Promise<any> {
    return this.listsRef.child(listId).child("admins").child(userId).set(true);
  }

  public deleteUserAdmin (listId: string, userId: string): firebase.Promise<any> {
    return this.listsRef.child(listId).child("admins").child(userId).set(null);
  }

  public isCreator (list:any, creatorId:string ): Boolean{
    if (list.userCreator == creatorId) {
      return true;
    }
  }

  public isAdmin (list:any, userId: string): Boolean {
    var isAdmin: Boolean = false;
    if (list.userCreator == userId) {
      return true;
    }
    for (var key in list.admins) {
      if (key == userId) {
        isAdmin = true;
      }
    }
    return isAdmin;
  }

  public deleteUserList(userId: string, listId:string): firebase.Promise<any> {
    var updates = {};
    updates[`lists/${listId}/users/${userId}`] = null;
    updates[`users/${userId}/lists/${listId}`] = null;
    return firebase.database().ref().update(updates);
  }

  public deleteList(listId:string, users: any[]): firebase.Promise<any>{
    var updates = {};
    updates[`lists/${listId}`] = null;
    updates[`itemsLists/${listId}`] = null;
    users.forEach((user) => {
      updates[`users/${user.$key}/lists/${listId}`] = null;
    });
    return firebase.database().ref().update(updates);
  }

}
