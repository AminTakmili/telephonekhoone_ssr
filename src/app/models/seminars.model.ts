import { Category } from "./categories.model";
import { Deserializable } from "./deserializable.model";
export class Seminars implements Deserializable {
  capacity: number;
  category: Category;
  holding_date: string;
  id: number;
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
    Object.assign(this, input);
    this.category = new Category().deserialize(input.category);
    this.logo = input.media.find((x) => x.name == "logo");
    console.log(this.logo);
    this.presenter_profile = input.media.find((x) => x.name == "presenter_profile");
    return this;
  }
}
