export class User {
  uid: any;
  fullname: string;
  email:string;
  photo:any;

  constructor(user: any) {
    this.uid = user.uid;
    this.fullname = user.displayName;
    this.email = user.email;
    this.photo = user.photoURL;
  }
}