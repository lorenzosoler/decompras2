export class User {
  uid: any;
  fullname: String;
  email:String;
  photo:any;

  constructor(user: any) {
    this.uid = user.uid;
    this.fullname = user.displayName;
    this.email = user.email;
    this.photo = user.photo;
  }
}