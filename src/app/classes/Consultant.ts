export class Consultant {
	private _category;
	public get category() {
		return this._category;
	}
	public set category(value) {
		this._category = value;
	}
	private _timeline: Timeline[];
	public get timeline(): Timeline[] {
		return this._timeline;
	}
	public set timeline(value: Timeline[]) {
		this._timeline = value;
	}

	private _title: string;
	public get title(): string {
		return this._title;
	}
	public set title(value: string) {
		this._title = value;
	}
	private _plan_min_price_call: number;
	public get plan_min_price_call(): number {
		return this._plan_min_price_call;
	}
	public set plan_min_price_call(value: number) {
		this._plan_min_price_call = value;
	}
	private _plan_min_price_chat: number;
	public get plan_min_price_chat(): number {
		return this._plan_min_price_chat;
	}
	public set plan_min_price_chat(value: number) {
		this._plan_min_price_chat = value;
	}

	private _rate: string;
	public get rate(): string {
		return this._rate;
	}
	public set rate(value: string) {
		this._rate = value;
	}
	private _plan: any;
	public get plan(): any {
		return this._plan;
	}
	public set plan(value: any) {
		this._plan = value;
	}
	private _country: any;
	public get country(): any {
		return this._country;
	}
	public set country(value: any) {
		this._country = value;
	}

	private _consultantPlan_price: ConsultantPlanPrice[];
	public get consultantPlan_price(): ConsultantPlanPrice[] {
		return this._consultantPlan_price;
	}
	public set consultantPlan_price(value: ConsultantPlanPrice[]) {
		this._consultantPlan_price = value;
	}

	private _consultantPlan_category: string;
	public get consultantPlan_category(): string {
		return this._consultantPlan_category;
	}
	public set consultantPlan_category(value: string) {
		this._consultantPlan_category = value;
	}
	private _consultantPlan_id: number;
	public get consultantPlan_id(): number {
		return this._consultantPlan_id;
	}
	public set consultantPlan_id(value: number) {
		this._consultantPlan_id = value;
	}
	private _consultantPlan_timeline: Timeline[];
	public get consultantPlan_timeline(): Timeline[] {
		return this._consultantPlan_timeline;
	}
	public set consultantPlan_timeline(value: Timeline[]) {
		this._consultantPlan_timeline = value;
	}
	private _consultant_id: number;
	public get consultant_id(): number {
		return this._consultant_id;
	}
	public set consultant_id(value: number) {
		this._consultant_id = value;
	}
	private _consultant_name: string;
	public get consultant_name(): string {
		return this._consultant_name;
	}
	public set consultant_name(value: string) {
		this._consultant_name = value;
	}
	private _description: string;
	public get description(): string {
		return this._description;
	}
	public set description(value: string) {
		this._description = value;
	}
	private _is_online: number;
	public get is_online(): number {
		return this._is_online;
	}
	public set is_online(value: number) {
		this._is_online = value;
	}
	private _meta_description: string;
	public get meta_description(): string {
		return this._meta_description;
	}
	public set meta_description(value: string) {
		this._meta_description = value;
	}
	private _meta_keywords: string;
	public get meta_keywords(): string {
		return this._meta_keywords;
	}
	public set meta_keywords(value: string) {
		this._meta_keywords = value;
	}
	private _meta_title: string;
	public get meta_title(): string {
		return this._meta_title;
	}
	public set meta_title(value: string) {
		this._meta_title = value;
	}
	private _personal_code: string;
	public get personal_code(): string {
		return this._personal_code;
	}
	public set personal_code(value: string) {
		this._personal_code = value;
	}
	private _minPriceCall: Price;
	public get minPriceCall(): Price {
		return this._minPriceCall;
	}
	public set minPriceCall(value: Price) {
		this._minPriceCall = value;
	}
	private _minPriceChat: Price;
	public get minPriceChat(): Price {
		return this._minPriceChat;
	}
	public set minPriceChat(value: Price) {
		this._minPriceChat = value;
	}
	private _media: any;
	public get media(): any {
		return this._media;
	}
	public set media(value: any) {
		this._media = value;
	}
	private _days: Days[];
	public get days(): Days[] {
		return this._days;
	}
	public set days(value: Days[]) {
		this._days = value;
	}

	private _call_message: string;
	public get call_message(): string {
		return this._call_message;
	}
	public set call_message(value: string) {
		this._call_message = value;
	}

	private _chat_message: string;
	public get chat_message(): string {
		return this._chat_message;
	}
	public set chat_message(value: string) {
		this._chat_message = value;
	}

	private _is_voice_call: number;
	public get is_voice_call(): number {
		return this._is_voice_call;
	}
	public set is_voice_call(value: number) {
		this._is_voice_call = value;
	}

	private _is_chat: number;
	public get is_chat(): number {
		return this._is_chat;
	}
	public set is_chat(value: number) {
		this._is_chat = value;
	}


}

export class Price {
	private _id: number;
	public get id(): number {
		return this._id;
	}
	public set id(value: number) {
		this._id = value;
	}
	private _key: string;
	public get key(): string {
		return this._key;
	}
	public set key(value: string) {
		this._key = value;
	}
	private _value: number;
	public get value(): number {
		return this._value;
	}
	public set value(value: number) {
		this._value = value;
	}
}

export class Timeline {
	private _from: string;
	public get from(): string {
		return this._from;
	}
	public set from(value: string) {
		this._from = value;
	}
	private _id: number;
	public get id(): number {
		return this._id;
	}
	public set id(value: number) {
		this._id = value;
	}
	private _reserve_day: string;
	public get reserve_day(): string {
		return this._reserve_day;
	}
	public set reserve_day(value: string) {
		this._reserve_day = value;
	}
	private _to: string;
	public get to(): string {
		return this._to;
	}
	public set to(value: string) {
		this._to = value;
	}
}

export class Days {
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
}

export class ConsultantPlanPrice {
	private _type: string;
	public get type(): string {
		return this._type;
	}
	public set type(value: string) {
		this._type = value;
	}
	private _name: string;
	public get name(): string {
		return this._name;
	}
	public set name(value: string) {
		this._name = value;
	}
	private _category_item_id_1: number;
	public get category_item_id(): number {
		return this._category_item_id_1;
	}
	public set category_item_id(value: number) {
		this._category_item_id_1 = value;
	}
	private _consultant_id: number;
	public get consultant_id(): number {
		return this._consultant_id;
	}
	public set consultant_id(value: number) {
		this._consultant_id = value;
	}
	private _consultant_plan_id: number;
	public get consultant_plan_id(): number {
		return this._consultant_plan_id;
	}
	public set consultant_plan_id(value: number) {
		this._consultant_plan_id = value;
	}
	private _created_at: string;
	public get created_at(): string {
		return this._created_at;
	}
	public set created_at(value: string) {
		this._created_at = value;
	}
	private _deleted_at: string;
	public get deleted_at(): string {
		return this._deleted_at;
	}
	public set deleted_at(value: string) {
		this._deleted_at = value;
	}
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
	private _updated_at: string;
	public get updated_at(): string {
		return this._updated_at;
	}
	public set updated_at(value: string) {
		this._updated_at = value;
	}
}
