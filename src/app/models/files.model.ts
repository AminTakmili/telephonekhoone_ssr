import { Deserializable } from './deserializable.model';

export class Files implements Deserializable {
	loading: boolean;
	lastModified: number;
	lastModifiedDate: any;
	name: string;
	size: number;
	type: string;
	webkitRelativePath: string;
	deserialize(input: any): this {
		Object.assign(this, input);
		return this;
	}
}
