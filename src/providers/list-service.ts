import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import firebase from 'firebase';
import { UserService } from "./user-service";
import { Lista } from "../models/lista"
import { Observable } from "rxjs/Observable";

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ListService {
  private listsRef = firebase.database().ref('lists');

  constructor(public userService: UserService) {
  }

  public saveList(list: any) {
    var currentUser = this.userService.getCurrentUser();
    list.creator = currentUser.uid;
    list.users = {};
    list.users[currentUser.uid] = true;
    let listId = this.listsRef.push(list).key;
    this.userService.addList(listId);
    list.creator = currentUser;
    return list;
  }

}
