import { Deserializable } from './deserializable.model';

export class Chat implements Deserializable {
	created_at: string;
	ended_at: string;
	id: number;
	user_plan_id: number;
	routerLink: string;
	status_text: string;
	wait_time: string;
	remain_price: number;
	deserialize(input: any): this {
		Object.assign(this, input);
		this.routerLink = `/conversation/detail/${input.id}`
		return this;
	}
}
