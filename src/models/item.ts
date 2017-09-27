export class Item {
  id: any;
  name: String;
  price: Number;

  constructor(item: any) {
    this.id = item.id;
    this.name = item.name;
    this.price = item.price;
  }
}