import { Category } from "./categories.model";
import { Deserializable } from "./deserializable.model";
export class Seminars implements Deserializable {
  capacity: number;
  category: Category;
  holding_date: string;
  id: number;
  link: string;
  price: number;
  title: string;
  users_count: number;
  media: any;
  logo: any;
  presenter_profile: any;
  meta_description: string;
  meta_keywords: string;
  meta_title: string;
  description: string;
  is_reserved: boolean;
  presenter_name: string;

  deserialize(input: any) {
    console.log(input);
    Object.assign(this, input);
    this.category = new Category().deserialize(input.category);
    this.logo = input.media.find((x) => x.name == "logo");
    this.link=input.seo.link
    console.log(this.logo);
    this.presenter_profile = input.media.find((x) => x.name == "presenter_profile");
    console.log(this);
    return this;
  }
}
