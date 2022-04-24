import { Deserializable } from "./deserializable.model";

export class Reserve implements Deserializable {
  from: string;
  id: number;
  is_active: number;
  reserve_day: string;
  reserve_day_archive: string;
  reserves_count: number;
  to: string;
  loading: boolean;

  deserialize(input: any): this {
    Object.assign(this, input);
    this.loading = false;
    return this;
  }
}
