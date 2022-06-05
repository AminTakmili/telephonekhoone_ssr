export class Categories  {
  private _children: any;
  public get children(): any {
    return this._children;
  }
  public set children(value: any) {
    this._children = value;
  }
  private _media: any;
  public get media(): any {
    return this._media;
  }
  public set media(value: any) {
    this._media = value;
  }
  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  public seo: object;
  public get setSeo(): object {
    return this.seo;
  }
  public set setSeo(value: object) {
    this.seo = value;
  }
  private _parent: boolean;
  public get parent(): boolean {
    return this._parent;
  }
  public set parent(value: boolean) {
    this._parent = value;
  }
  private _active: boolean;
  public get active(): boolean {
    return this._active;
  }
  public set active(value: boolean) {
    this._active = value;
  }

  private _id: number;
  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }

  private _consultants: Consultants[];
  public get consultants(): Consultants[] {
    return this._consultants;
  }
  public set consultants(value: Consultants[]) {
    this._consultants = value;
  }
}

export class Consultants {
  private _id: number;
  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  private _media: any;
  public get media(): any {
    return this._media;
  }
  public set media(value: any) {
    this._media = value;
  }
}

export class Searchitem {
  private _category_item_id: number;
  public get category_item_id(): number {
    return this._category_item_id;
  }
  public set category_item_id(value: number) {
    this._category_item_id = value;
  }
  private _category_item_link: string;
  public get category_item_link(): string {
    return this._category_item_link;
  }
  public set category_item_link(value: string) {
    this._category_item_link = value;
  }
  private _consultations: number;
  public get consultations(): number {
    return this._consultations;
  }
  public set consultations(value: number) {
    this._consultations = value;
  }

  private _country: string;
  public get country(): string {
    return this._country;
  }
  public set country(value: string) {
    this._country = value;
  }
  private _fullname: string;
  public get fullname(): string {
    return this._fullname;
  }
  public set fullname(value: string) {
    this._fullname = value;
  }
  private _id: number|string;
  public get id(): number|string {
    return this._id;
  }
  public set id(value: number|string) {
    this._id = value;
  }
  private _link: string;
  public get link(): string {
    return this._link;
  }
  public set link(value: string) {
    this._link = value;
  }
  private _image: any;
  public get image(): any {
    return this._image;
  }
  public set image(value: any) {
    this._image = value;
  }
  private _is_online: number;
  public get is_online(): number {
    return this._is_online;
  }
  public set is_online(value: number) {
    this._is_online = value;
  }
  private _prices: Prices[];
  public get prices(): Prices[] {
    return this._prices;
  }
  public set prices(value: Prices[]) {
    this._prices = value;
  }
  private _rate: number;
  public get rate(): number {
    return this._rate;
  }
  public set rate(value: number) {
    this._rate = value;
  }
  private _title: string;
  public get title(): string {
    return this._title;
  }
  public set title(value: string) {
    this._title = value;
  }
}

export class Prices {
  private _id: number;
  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  private _is_active: number;
  public get is_active(): number {
    return this._is_active;
  }
  public set is_active(value: number) {
    this._is_active = value;
  }
  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  private _price: number;
  public get price(): number {
    return this._price;
  }
  public set price(value: number) {
    this._price = value;
  }
  private _price_extra: number;
  public get price_extra(): number {
    return this._price_extra;
  }
  public set price_extra(value: number) {
    this._price_extra = value;
  }
  private _time: string;
  public get time(): string {
    return this._time;
  }
  public set time(value: string) {
    this._time = value;
  }
  private _type: string;
  public get type(): string {
    return this._type;
  }
  public set type(value: string) {
    this._type = value;
  }
}
