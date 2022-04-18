export class UserInfo {
	private _personal_code: string;
	public get personal_code(): string {
		return this._personal_code;
	}
	public set personal_code(value: string) {
		this._personal_code = value;
	}
	private _description: string;
	public get description(): string {
		return this._description;
	}
	public set description(value: string) {
		this._description = value;
	}
	private _plans_count: number;
	public get plans_count(): number {
		return this._plans_count;
	}
	public set plans_count(value: number) {
		this._plans_count = value;
	}
	private _balance: number;
	public get balance(): number {
		return this._balance;
	}
	public set balance(value: number) {
		this._balance = value;
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
	private _mobile: string;
	public get mobile(): string {
		return this._mobile;
	}
	public set mobile(value: string) {
		this._mobile = value;
	}
	private _avatar: string;
	public get avatar(): string {
		return this._avatar;
	}
	public set avatar(value: string) {
		this._avatar = value;
	}

	private _type: string;
	public get type(): string {
		return this._type;
	}
	public set type(value: string) {
		this._type = value;
	}
	private _gender: string;
	public get gender(): string {
		return this._gender;
	}
	public set gender(value: string) {
		this._gender = value;
	}

	private _card: any;
	public get card(): any {
		return this._card;
	}
	public set card(value: any) {
		this._card = value;
	}

	private _category: any;
	public get category(): any {
		return this._category;
	}
	public set category(value: any) {
		this._category = value;
	}
	private _country: any;
	public get country(): any {
		return this._country;
	}
	public set country(value: any) {
		this._country = value;
	}
	private _is_chat: number;
	public get is_chat(): number {
		return this._is_chat;
	}
	public set is_chat(value: number) {
		this._is_chat = value;
	}
	private _is_online: number;
	public get is_online(): number {
		return this._is_online;
	}
	public set is_online(value: number) {
		this._is_online = value;
	}
	private _is_video_call: number;
	public get is_video_call(): number {
		return this._is_video_call;
	}
	public set is_video_call(value: number) {
		this._is_video_call = value;
	}
	private _is_voice_call: number;
	public get is_voice_call(): number {
		return this._is_voice_call;
	}
	public set is_voice_call(value: number) {
		this._is_voice_call = value;
	}
	private _media: any;
	public get media(): any {
		return this._media;
	}
	public set media(value: any) {
		this._media = value;
	}

	private _last_certificate: any;
	public get last_certificate(): any {
		return this._last_certificate;
	}
	public set last_certificate(value: any) {
		this._last_certificate = value;
	}

	private _experience_year: any;
	public get experience_year(): any {
		return this._experience_year;
	}
	public set experience_year(value: any) {
		this._experience_year = value;
	}
}
