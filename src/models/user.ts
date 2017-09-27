export class User {
  uid: any;
  fullname: string;
  searchname:string;
  email:string;
  photo:any;

  constructor(user: any) {
    this.uid = user.uid;
    this.fullname = user.displayName;
    this.searchname = this.fullname.toLowerCase().replace(/\s/g,"");
    this.email = user.email;
    this.photo = user.photoURL;
  }
}