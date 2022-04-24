import { Deserializable } from "./deserializable.model";

export class Category implements Deserializable {
  id: number;
  name: string;
  entity_count: number;
  children: Category;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
