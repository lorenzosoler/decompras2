export class User {
    private uid: String;
    private fullname: String;
    private email: String;
    private photo: String;


	constructor($uid: String, $fullname: String, $email: String, $photo: String) {
		this.uid = $uid;
		this.fullname = $fullname;
		this.email = $email;
		this.photo = $photo;
	}

	public get $uid(): String {
		return this.uid;
	}

    public set $uid(value: String) {
		this.uid = value;
	}

	public get $email(): String {
		return this.email;
	}

	public set $email(value: String) {
		this.email = value;
	}

	public get $fullname(): String {
		return this.fullname;
	}

	public set $fullname(value: String) {
		this.fullname = value;
	}
    

	public get $photo(): String {
		return this.photo;
	}

	public set $photo(value: String) {
		this.photo = value;
	}

}
