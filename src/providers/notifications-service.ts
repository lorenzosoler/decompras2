import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { User } from "../models/user";
import { UserService } from "./user-service";

@Injectable()
export class NotificationsService {
  private currentUser: User;

  constructor(private http: Http, private userService: UserService) {
    this.currentUser = this.userService.getCurrentUser();
  }

  public addUserList(list: any, user: any) {
    let body = {
        app_id: "8e4f03e5-8ffb-4fb8-9dd8-7136c5156202",
        filters: [
          {"field": "tag", "key": "userId", "relation": "=", "value": user.uid}
        ],
        headings: {"en": this.currentUser.fullname },
        contents: {"en": `Te agrego a la lista ${list.name}`},
        large_icon: this.currentUser.photo
    };
    let headers = new Headers({ 'Authorization': 'Basic NzgyYmQ1NjktNTMwNS00MWRmLWExMTYtNjEyYWU2OTA5OGUy' });
    let options = new RequestOptions({ headers: headers })
    this.http.post( "https://onesignal.com/api/v1/notifications", body, options).subscribe((data) => {
        console.log(data);
    })
  }

}