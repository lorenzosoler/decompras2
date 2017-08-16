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

  public saveList(list: any): any {
    var currentUser = this.userService.getCurrentUser();
    list.userCreator = currentUser.uid;
    list.created = firebase.database.ServerValue.TIMESTAMP;
    list.users = {};
    list.users[currentUser.uid] = true;
    let listId = this.listsRef.push(list).key;
    list.$key = listId;
    this.userService.addList(currentUser.uid, listId);
    return list;
  }

  public editList(key:string, editList: any): any {
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
