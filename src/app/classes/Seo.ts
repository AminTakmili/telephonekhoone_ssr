import * as _ from 'lodash';

export class Seo {
    private _metaTitle: string;
    public get metaTitle(): string {
        return this._metaTitle;
    }
    public set metaTitle(value: string) {
        this._metaTitle = value;
    }
    private _metaDescription: string;
    public get metaDescription(): string {
        return this._metaDescription;
    }
    public set metaDescription(value: string) {
        this._metaDescription = value;
    }
    private _metaKeywords: string[];
    public get metaKeywords(): string[] {
        return this._metaKeywords;
    }
    public set metaKeywords(value: string[]) {
        this._metaKeywords = value;
    }
    private _isNoIndex: Boolean;
    public get isNoIndex(): Boolean {
        return this._isNoIndex;
    }
    public set isNoIndex(value: Boolean) {
        this._isNoIndex = value;
    }
    private _pageLink: string;
    public get pageLink(): string {
        return this._pageLink;
    }
    public set pageLink(value: string) {
        this._pageLink = value;
    }
    private _pageLinkPrefix: string;
    public get pageLinkPrefix(): string {
        return this._pageLinkPrefix;
    }
    public set pageLinkPrefix(value: string) {
        this._pageLinkPrefix = value;
    }
    private _seoDescription: string;
    public get seoDescription(): string {
        return this._seoDescription;
    }
    public set seoDescription(value: string) {
        this._seoDescription = value;
    }
    private _canonicalLink: string;
    public get canonicalLink(): string {
        return this._canonicalLink;
    }
    public set canonicalLink(value: string) {
        this._canonicalLink = value;
    }
}

export class Offer {
    private "_@type": string;
    public get "@type"(): string {
        return this["_@type"];
    }
    public set "@type"(value: string) {
        this["_@type"] = value;
    }
    private _availability: string;
    public get availability(): string {
        return this._availability;
    }
    public set availability(value: string) {
        this._availability = value;
    }
    private _priceCurrency: string;
    public get priceCurrency(): string {
        return this._priceCurrency;
    }
    public set priceCurrency(value: string) {
        this._priceCurrency = value;
    }
    private _price: number;
    public get price(): number {
        return this._price;
    }
    public set price(value: number) {
        this._price = value;
    }
    private _url: string;
    public get url(): string {
        return this._url;
    }
    public set url(value: string) {
        this._url = value;
    }
    private _priceValidUntil: string;
    public get priceValidUntil(): string {
        return this._priceValidUntil;
    }
    public set priceValidUntil(value: string) {
        this._priceValidUntil = value;
    }
    private _itemCondition: string;
    public get itemCondition(): string {
        return this._itemCondition;
    }
    public set itemCondition(value: string) {
        this._itemCondition = value;
    }

    getData() {
        let data = {};
        Object.entries(Object.getOwnPropertyDescriptors(this)).map(item => {
            let obj = {};
            obj[_.trimStart(item[0], '_')] = item[1].value;
            Object.assign(data, obj);
        });
        return data;
    }
}

export class BreadCrumb{
    private "_@type": string;
    public get "@type"(): string {
        return this["_@type"];
    }
    public set "@type"(value: string) {
        this["_@type"] = value;
    }
    private _position: number;
    public get position(): number {
        return this._position;
    }
    public set position(value: number) {
        this._position = value;
    }
    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    private _item: string;
    public get item(): string {
        return this._item;
    }
    public set item(value: string) {
        this._item = value;
    }
    getData() {
        let data = {};
        Object.entries(Object.getOwnPropertyDescriptors(this)).map(item => {
            let obj = {};
            obj[_.trimStart(item[0], '_')] = item[1].value;
            Object.assign(data, obj);
        });
        return data;
    }
}

export class Review {
    private "_@type_1": string;
    public get "@type"(): string {
        return this["_@type_1"];
    }
    public set "@type"(value: string) {
        this["_@type_1"] = value;
    }
    private _author: string;
    public get author(): string {
        return this._author;
    }
    public set author(value: string) {
        this._author = value;
    }
    private _datePublished: string;
    public get datePublished(): string {
        return this._datePublished;
    }
    public set datePublished(value: string) {
        this._datePublished = value;
    }
    private _reviewBody: string;
    public get reviewBody(): string {
        return this._reviewBody;
    }
    public set reviewBody(value: string) {
        this._reviewBody = value;
    }
    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    getData() {
        let data = {};
        Object.entries(Object.getOwnPropertyDescriptors(this)).map(item => {
            let obj = {};
            obj[_.trimStart(item[0], '_')] = item[1].value;
            Object.assign(data, obj);
        });
        return data;
    }
}
export class ProductReview {
    private "_@type": string;
    public get "@type"(): string {
        return this["_@type"];
    }
    public set "@type"(value: string) {
        this["_@type"] = value;
    }

    private _reviewRating: any;
    public get reviewRating(): any {
        return this._reviewRating;
    }
    public set reviewRating(value: any) {
        this._reviewRating = value;
    }

    private _author: any;
    public get author(): any {
        return this._author;
    }
    public set author(value: any) {
        this._author = value;
    }

    getData() {
        let data = {};
        Object.entries(Object.getOwnPropertyDescriptors(this)).map(item => {
            let obj = {};
            obj[_.trimStart(item[0], '_')] = item[1].value;
            Object.assign(data, obj);
        });
        return data;
    }
}

export class reviewRating{

    private "_@type": string;
    public get "@type"(): string {
        return this["_@type"];
    }
    public set "@type"(value: string) {
        this["_@type"] = value;
    }

    private _ratingValue: string;
    public get ratingValue(): string {
        return this._ratingValue;
    }
    public set ratingValue(value: string) {
        this._ratingValue = value;
    }


    private _bestRating: string;
    public get bestRating(): string {
        return this._bestRating;
    }
    public set bestRating(value: string) {
        this._bestRating = value;
    }

    getData() {
        let data = {};
        Object.entries(Object.getOwnPropertyDescriptors(this)).map(item => {
            let obj = {};
            obj[_.trimStart(item[0], '_')] = item[1].value;
            Object.assign(data, obj);
        });
        return data;
    }
}

export class author{

    private "_@type": string;
    public get "@type"(): string {
        return this["_@type"];
    }
    public set "@type"(value: string) {
        this["_@type"] = value;
    }

    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    getData() {
        let data = {};
        Object.entries(Object.getOwnPropertyDescriptors(this)).map(item => {
            let obj = {};
            obj[_.trimStart(item[0], '_')] = item[1].value;
            Object.assign(data, obj);
        });
        return data;
    }
}