import { Deserializable } from "./deserializable.model";

export interface MediaConsultant {
	fullName: string;
	image: any;
}

export class UserMedia implements Deserializable {
	id: number;
	title: string;
	link: string;
	type: string;
	price: number;
	created_at: string;
	consultant: MediaConsultant;

	deserialize(input: any) {
		console.log(input);
		Object.assign(this, input);
		const consultant = {} as MediaConsultant;
		consultant.fullName = input.fullname;
		consultant.image = input.image;
		this.consultant = consultant;
		input.seo? this.link=input.seo['link']:''
		return this;
	}
}

export class UserMediaDetail implements Deserializable {
	paid: boolean;
	id: number;
	title: string;
	description: string;
	type: string;
	price: number;
	created_at: string;
	consultant: MediaConsultant;
	media: any;
	deserialize(input: any) {
		Object.assign(this, input);
		const consultant = {} as MediaConsultant;
		consultant.fullName = input.consultant.fullname;
		consultant.image = input.consultant.image;
		this.consultant = consultant;
		return this;
	}
}

