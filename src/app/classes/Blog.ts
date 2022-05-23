export class Blog {
  private _category: any;
  public get category(): any {
    return this._category;
  }
  public set category(value: any) {
    this._category = value;
  }
  private _admin: Admin;
  public get admin(): Admin {
    return this._admin;
  }
  public set admin(value: Admin) {
    this._admin = value;
  }
  private _created_at: string;
  public get created_at(): string {
    return this._created_at;
  }
  public set created_at(value: string) {
    this._created_at = value;
  }
  private _id: number|string;
  public get id(): number|string {
    return this._id;
  }
  public set id(value: number|string) {
    this._id = value;
  }
  private _title: string;
  public get title(): string {
    return this._title;
  }
  public set title(value: string) {
    this._title = value;
  }
  private _media: any;
  public get media(): any {
    return this._media;
  }
  public set media(value: any) {
    this._media = value;
  }
}

export class Admin {
  private _fullname: string;
  public get fullname(): string {
    return this._fullname;
  }
  public set fullname(value: string) {
    this._fullname = value;
  }
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

export class Categories {
  private _entity_count: number;
  public get entity_count(): number {
    return this._entity_count;
  }
  public set entity_count(value: number) {
    this._entity_count = value;
  }

  private _id: number;
  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }

  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  private _media: any;
  public get media(): any {
    return this._media;
  }
  public set media(value: any) {
    this._media = value;
  }
}

export class LatestPosts {
  private _created_at: string;
  public get created_at(): string {
    return this._created_at;
  }
  public set created_at(value: string) {
    this._created_at = value;
  }
  private _id: number;
  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  private _title: string;
  public get title(): string {
    return this._title;
  }
  public set title(value: string) {
    this._title = value;
  }
  private _media: string;
  public get media(): string {
    return this._media;
  }
  public set media(value: string) {
    this._media = value;
  }
}

export class BlogDetail {
  private _admin: any;
  public get admin(): any {
    return this._admin;
  }
  public set admin(value: any) {
    this._admin = value;
  }
  private _category_item_id: number;
  public get category_item_id(): number {
    return this._category_item_id;
  }
  public set category_item_id(value: number) {
    this._category_item_id = value;
  }
  private _comments: any;
  public get comments(): any {
    return this._comments;
  }
  public set comments(value: any) {
    this._comments = value;
  }
  private _comments_count: number;
  public get comments_count(): number {
    return this._comments_count;
  }
  public set comments_count(value: number) {
    this._comments_count = value;
  }
  private _created_at: string;
  public get created_at(): string {
    return this._created_at;
  }
  public set created_at(value: string) {
    this._created_at = value;
  }
  private _description: string;
  public get description(): string {
    return this._description;
  }
  public set description(value: string) {
    this._description = value;
  }
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
  private _meta_description: string;
  public get meta_description(): string {
    return this._meta_description;
  }
  public set meta_description(value: string) {
    this._meta_description = value;
  }
  private _meta_keywords: any;
  public get meta_keywords(): any {
    return this._meta_keywords;
  }
  public set meta_keywords(value: any) {
    this._meta_keywords = value;
  }
  private _meta_title: string;
  public get meta_title(): string {
    return this._meta_title;
  }
  public set meta_title(value: string) {
    this._meta_title = value;
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
  private _translations: string;
  public get translations(): string {
    return this._translations;
  }
  public set translations(value: string) {
    this._translations = value;
  }
  private _updated_a: string;
  public get updated_a(): string {
    return this._updated_a;
  }
  public set updated_a(value: string) {
    this._updated_a = value;
  }
}
