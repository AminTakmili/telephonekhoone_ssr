import { Inject, Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { Title, Meta, TransferState, makeStateKey } from '@angular/platform-browser';
import { GlobalService } from './global.service';
import { DOCUMENT } from '@angular/common';
import { Location, LocationStrategy } from '@angular/common';
//! import { Product } from '../Classes/Product';
import { Offer, Review, BreadCrumb, reviewRating, author, ProductReview } from '../Classes/Seo';
//! import { Comments } from '../Classes/Comments';
import { DateTime } from 'luxon';
import { Blog } from '../Classes/Blog';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private renderer: Renderer2;

    fullUrl: string;
    baseUrl: string;
    constructor(
        private titleService: Title,
        private metaService: Meta,
        public global: GlobalService,
        private rendererFactory: RendererFactory2,
        private location: Location,
        private locationStrategy: LocationStrategy,
        private router: Router,
        private transferState: TransferState,
        @Inject(DOCUMENT) private _document,
    ) {
        console.log(this.renderer);
        this.renderer = this.rendererFactory.createRenderer(null, null);
        console.log(this.renderer);

        // console.log(this.location.prepareExternalUrl('amin')) ;
        // this.baseUrl = this.locationStrategy['_platformLocation']['location']['protocol'] +"//"+this.locationStrategy['_platformLocation']['location']['host'];
        //  this.fullUrl = this.global.siteUrl +'/'+ decodeURI(this.router.routerState.snapshot.url.substr(1));
    }

    generateTags(config) {
        console.log(config);


        const fullUrl = this.global.siteUrl + '/' + decodeURI(this.router.routerState.snapshot.url.substr(1).split('?')[0]);
        this.titleService.setTitle(config.title);
        this.metaService.updateTag({ name: 'description', content: config.description });
        this.metaService.updateTag({ name: 'abstract', content: config.description });

        this.metaService.updateTag({ name: 'keywords', content: config.keywords });
        this.metaService.updateTag({ name: 'robots', content: (!config.noIndex ? 'index,follow' : 'noindex,nofollow') });
        // Twitter
        this.metaService.updateTag({ property: 'twitter:card', content: 'summary' });
        this.metaService.updateTag({ property: 'twitter:site', content: this.global.sitename });
        this.metaService.updateTag({ property: 'twitter:title', content: config.title });
        this.metaService.updateTag({ property: 'twitter:description', content: config.description });
        this.metaService.updateTag({ property: 'twitter:image', content: config.image });
        // Facebook
        this.metaService.updateTag({ property: 'og:type', content: 'website' });
        this.metaService.updateTag({ property: 'og:site_name', content: this.global.sitename });
        this.metaService.updateTag({ property: 'og:url', content: fullUrl });
        this.metaService.updateTag({ property: 'og:title', content: config.title });
        this.metaService.updateTag({ property: 'og:description', content: config.description });
        this.metaService.updateTag({ property: 'og:image', content: config.image });
        const key = makeStateKey<any>('canonical');

        if (this.transferState.hasKey(key)) {

        } else {
            const canonical_url = (config.canonical && config.canonical.length > 0) ? config.canonical : fullUrl;
            this.createLinkForCanonicalURL(canonical_url);
        }
    }

    //? productSchema(
    //     product: Product,
    //     averageRate,
    //     averageCount,
    //     comment: Comments[]
    // ) {

    //     let seoImage: string[] = [];
    //     product.media.map((item) => {
    //     for (const [key, value] of Object.entries(item.options?.subSizes)) {
    //         seoImage.push(value) 
    //         // console.log(`${key}: ${value}`);
    //       }
    //     });
    //     // console.log(seoImage);
        
    //     // const seoImage: string[] = product.media.map((item) => { return item.options.subSizes['2x']; });
    //     // const seoImage: string[] = product.media[0].options.subSizes;

    //     let SeoOffer = product.prices.map((item) => {
    //         const offer: Offer = new Offer();
    //         offer['@type'] = "Offer";
    //         offer.availability = (item.state === "PRODUCT_IN_STOCK" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock");
    //         offer.priceCurrency = "IRR";
    //         offer.price = (item.state === "PRODUCT_IN_STOCK" ? item.discountedPrice : 0);
    //         offer.url = this.global.siteUrl + decodeURI(this.router.url);
    //         offer.itemCondition = "http://schema.org/NewCondition";
    //         offer.priceValidUntil = DateTime.local().plus({ days: 10 }).toFormat('yyyy-LL-dd');
    //         return offer.getData();
    //     });

    //     const commentLists = comment.map((item) => {

    //         const review: ProductReview = new ProductReview();
    //         review['@type'] = "Review";

    //         const reviewAthor: author = new author();
    //         reviewAthor['@type'] = "Person";
    //         reviewAthor.name = item.firstName + ' ' + item.lastName;
    //         review.author = reviewAthor.getData();

    //         const reviewrateing: reviewRating = new reviewRating();
    //         reviewrateing['@type'] = "Rating";
    //         reviewrateing.ratingValue = averageRate.toString()
    //         reviewrateing.bestRating = "5"

    //         review.reviewRating = reviewrateing.getData();

    //         return review.getData();
    //     })

    //     let SEOJSON = {
    //         "@context": "http://schema.org/",
    //         "@type": "Product",
    //         "name": product.name,
    //         "alternateName": product.secondName,
    //         "image": seoImage,
    //         "description": this.transform(product.seoinfo.metaDescription),
    //         "mpn": product.id.toString(),

    //         "brand": {
    //             "@type": "Brand",
    //             "name": product.brand.name
    //         },
    //         "aggregateRating": {
    //             "@type": "AggregateRating",
    //             "ratingValue": averageRate.toString(),
    //             "reviewCount": averageCount.toString()
    //         },
    //         "offers": [SeoOffer],
    //         "sku": (product.id + 120000)
    //     };

    //     if (commentLists.length) {
    //         SEOJSON['review'] = commentLists;
    //     } else {

    //         const review: ProductReview = new ProductReview();
    //         review['@type'] = "Review";

    //         const reviewAthor: author = new author();
    //         reviewAthor['@type'] = "Person";
    //         reviewAthor.name = "داروهوم - کاربر";

    //         review.author = reviewAthor.getData();

    //         const reviewrateing: reviewRating = new reviewRating();
    //         reviewrateing['@type'] = "Rating";
    //         reviewrateing.ratingValue = averageRate.toString()
    //         reviewrateing.bestRating = "5"

    //         review.reviewRating = reviewrateing.getData();


    //         SEOJSON['review'] = [review.getData()];
    //     }

    //     return this.GenerateSchema(SEOJSON);
    // }

    // TODO: ArticleSchema(blog: Blog) {

    //     const seoImage: string[] = blog.media.map((item) => { return item.options.subSizes['2x']; });

    //     const SEOJSON = {
    //         "@context": "http://schema.org",
    //         "@type": "Article",
    //         "mainEntityOfPage": {
    //             "@type": "WebPage",
    //             "@id": "https://google.com/article"
    //         },
    //         "headline": blog.name,
    //         "image": seoImage,
    //         "datePublished": blog.createdAtEn,
    //         "dateModified": blog.updatedAtEn,
    //         "author": {
    //             "@type": "Person",
    //             "name": blog.author.firstName + " " + blog.author.lastName
    //         },
    //         "publisher": {
    //             "@type": "Organization",
    //             "name": this.global.sitename,
    //             "logo": {
    //                 "@type": "ImageObject",
    //                 "url": this.location.prepareExternalUrl("/assets/extra/img/new-logo.svg")
    //             }
    //         },
    //         "description": this.transform(blog.shortContent)

    //     };

    //     this.GenerateSchema(SEOJSON);
    //TODO: }

    BreadcrumbSchema(breadcrumb) {

        // console.log(breadcrumb);
        const breadcrumbList = breadcrumb.map((item, index) => {
            const breadcrumb: BreadCrumb = new BreadCrumb();
            breadcrumb['@type'] = "ListItem";
            breadcrumb.position = index + 1;
            breadcrumb.name = item.name;
            breadcrumb.item = encodeURI(this.global.siteUrl + item.url.substr(1));
            return breadcrumb.getData();
        })


        const SEOJSON = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbList
        };

        this.GenerateSchema(SEOJSON);
    }

    LogoSchema() {

        const SEOJSON = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "url": this.global.siteUrl,
            "logo": this.global.siteUrl + '/' + 'assets/extra/img/logo-500x500.png'
        };

        this.GenerateSchema(SEOJSON);
    }

    BusinessSchema() {

        const SEOJSON = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "داروهوم - DarooHome",
            "image": this.global.siteUrl + '/' + 'assets/extra/img/logo-500x500.png',
            "@id": "https://daroohome.com/",
            "url": "https://daroohome.com/",
            "telephone": "+982126720712",
            "priceRange": "IRR",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "تهران, خیابان شریعتی، بالاتر از تقاطع میرداماد، کوچه آهور، پلاک 40",
                "addressLocality": "Tehran",
                "postalCode": "1948853454",
                "addressCountry": "IR"
            },
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Saturday",
                    "Sunday"
                ],
                "opens": "10:00",
                "closes": "21:00"
            },
            "sameAs": ["https://www.instagram.com/daroohome/"]
        };

        this.GenerateSchema(SEOJSON);
    }

    ContactShema() {
        const SEOJSON = {
            "@context": "http://schema.org",
            "@type": "Organization",
            "url": "https://daroohome.com/",
            "logo": "https://daroohome.com/assets/extra/img/logo-500x500.png",
            "contactPoint": [{
                "@type": "ContactPoint",
                "telephone": "+982126720712",
                "contactType": "customer service"
            }]
        };
        this.GenerateSchema(SEOJSON);
    }

    GenerateSchema(jsonLD) {
        const json = jsonLD ? JSON.stringify(jsonLD, null, 2).replace(/<\/script>/g, '<\\/script>') : '';
        const script = this.renderer.createElement('script');
        this.renderer.appendChild(script, this.renderer.createText(json));
        this.renderer.setAttribute(script, 'type', 'application/ld+json');
        // return `<script type="application/ld+json">${json}</script>`;
        this.renderer.appendChild(this._document.head, script);
    }

    transform(value: string): any {
        return value.replace(/<.*?>/g, ''); // replace tags
    }

    redirect(url) {
        this.metaService.updateTag({ httpEquiv: 'refresh', content: "0; " + url });
    }

    createLinkForCanonicalURL(url) {

        const head = this._document.getElementsByTagName('head')[0];
        var element: HTMLLinkElement = this._document.querySelector(`link[rel='canonical']`) || null;
        if (element == null) {
            element = this._document.createElement('link') as HTMLLinkElement;
            head.appendChild(element);
        }
        
        element.setAttribute('rel', 'canonical');
        element.setAttribute('href', url);
    }

    setAMP() {


        const body = this._document.getElementsByTagName('html')[0];
        body.setAttribute('amp',true);
    }

    addAMpScript(url) {

        const head = this._document.getElementsByTagName('head')[0];
        var element: HTMLLinkElement = this._document.querySelector(`link[rel='amphtml']`) || null;
        element = this._document.createElement('link') as HTMLLinkElement;
        // element.setAttribute('rel', 'canonical');
        element.setAttribute('rel', 'amphtml');
        element.setAttribute('href', 'https://daroohome.com/amp/p/'+url);
        head.appendChild(element);
    }
    removeAMpScript(){
        const head = this._document.getElementsByTagName('head')[0];
        var element: HTMLLinkElement = this._document.querySelector(`link[rel='amphtml']`) || null;
        if (element !== null) {
            head.removeChild(element);
        }
    }
}

