import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationsService {

  constructor(private http: Http) { }

  public addUserList(list: any, user: any) {
    let body = {
        app_id: "8e4f03e5-8ffb-4fb8-9dd8-7136c5156202",
        included_segments: ["All"],
        contents: {"en": "English Message"}
    };
    let headers = new Headers({ 'Authorization': 'Basic NzgyYmQ1NjktNTMwNS00MWRmLWExMTYtNjEyYWU2OTA5OGUy' });
    let options = new RequestOptions({ headers: headers })
    this.http.post( "https://onesignal.com/api/v1/notifications", body, options).subscribe((data) => {
        console.log(data);
    })
  }

}