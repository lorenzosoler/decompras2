import { User } from "./user";
import { Item } from "./item";

export class Lista {
  id: any;
  name: String;
  detail:String;
  items: Array<Item>
  creator:User;
  participants: Array<User>

  constructor(lista: any) {
    this.id = lista.id;
    this.name = lista.name;
    this.detail = lista.detail;
    this.items = lista.items;
    this.creator = lista.creator;
    this.participants = lista.participants; 
  }
}