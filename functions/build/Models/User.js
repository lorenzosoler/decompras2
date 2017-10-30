"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor($uid, $fullname, $email, $photo) {
        this.uid = $uid;
        this.fullname = $fullname;
        this.email = $email;
        this.photo = $photo;
    }
    get $uid() {
        return this.uid;
    }
    set $uid(value) {
        this.uid = value;
    }
    get $email() {
        return this.email;
    }
    set $email(value) {
        this.email = value;
    }
    get $fullname() {
        return this.fullname;
    }
    set $fullname(value) {
        this.fullname = value;
    }
    get $photo() {
        return this.photo;
    }
    set $photo(value) {
        this.photo = value;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map