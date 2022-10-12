import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
	IonCard,
	IonContent,
	IonSearchbar,
	IonSlides,
	PopoverController,
} from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { Prices, Searchitem } from 'src/app/classes/Categories';
import { CountriesPopoverComponent } from 'src/app/components/countries-popover/countries-popover.component';
import { AnimationOptions } from 'ngx-lottie';
import * as searchAnimation from '../../../assets/animations/13525-empty.json';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SeoService } from 'src/app/services/seo.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
	selector: 'app-sub-categori-list',
	templateUrl: './sub-categori-list.component.html',
	styleUrls: ['./sub-categori-list.component.scss'],
	animations: [
		trigger('myfirstanimation', [
			state(
				'close',
				style({
					height: 'auto',
					maxHeight: '320px',
					position: 'relative'
				})
			),
			state(
				'open',
				style({
					height: '*',
					maxHeight: '*',
				})
			),
			transition('close <=> open', animate('600ms ease-in')),
		]),
	]
})

export class SubCategoriListComponent implements OnInit, OnDestroy, AfterViewChecked {

	@ViewChild('DesktopMenu') DesktopMenu: IonSlides;
	@ViewChild('searchBar') searchBar: IonSearchbar;
	@ViewChild('ionCardContainer') ionCardContainer: ElementRef;
	state = 'close';
	isState = true;
	listCount = 0;
	emptyAnimation: any;
	searchAnimate: AnimationOptions = {
		animationData: searchAnimation['default'],
		loop: false,
		autoplay: false,
	};
	loading = false;
	filterRequest: any;
	myId = null;
	filter = '';
	selectedCountry = null;
	selectedCountryName = 'انتخاب کشور';
	limit = 10;
	sortingList = [
		{ name: 'مشاوران آنلاین', value: 'online' },
		{ name: 'مشاوران آفلاین', value: 'offline' },
		{ name: 'بیشترین امتیاز', value: 'rate' },
	];
	sortItem = null;
	offset = 0;
	countries = [{ id: 0, name: 'مشاهده همه' }];
	searchList: Searchitem[] = [];
	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/c', name: 'دسته بندی' },
	];
	galleryThumbsConfig2 = {
		spaceBetween: 0,
		slidesPerView: 'auto',
		freeModeSticky: true,
		slideToClickedSlide: true,
		freeMode: true,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
	};
	meta_description: string;
	filterSubject = new Subject<any>();
	h1: string;
	categoryName: string;

	constructor(
		private global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private popoverController: PopoverController,
		private fb: FormBuilder,
		public seo: SeoService,

	) {
	}

	ngAfterViewChecked(): void {
		if(this.ionCardContainer.nativeElement.offsetHeight >= 49) {
			if(this.ionCardContainer.nativeElement.offsetHeight >= 320) {
				this.isState = false;
			}
		}
	}

	ngOnDestroy() {
		this.filterSubject.unsubscribe();
	}

	ionViewDidEnter() {
		console.log(this.ionCardContainer.nativeElement.offsetHeight);
	}

	ngOnInit() {
		this.myId = this.activatedRoute.snapshot.paramMap.get('subCatId');
		this.filter = this.activatedRoute.snapshot.paramMap.get('filter');
		this.showCategoryData(this.myId, null, null, null);

		this.filterSubject
			.pipe(debounceTime(1000))
			.pipe(distinctUntilChanged())
			.subscribe(() => {
				this.searchItems();
			});
	}

	handleEmptyAnimation(anim: any) {
		this.emptyAnimation = anim;
	}

	loadSwiper() {
		this.global.SSRsetTimeout(() => {
			this.DesktopMenu.update();
		}, 2000);
	}

	async countriesPopover(ev: any) {
		const popover = await this.popoverController.create({
			component: CountriesPopoverComponent,
			event: ev,
			translucent: false,
			componentProps: {
				list: this.countries,
			},
		});
		if (this.countries.length != 0) {
			await popover.present();
		}

		popover.onWillDismiss().then((data) => {
			if (data.data) {
				this.selectedCountry = data.data;
				this.selectedCountryName = data.data.name;
			}
		});
	}

	searchItems() {
		if (this.filterRequest) {
			this.filterRequest.unsubscribe();
		}
		this.showCategoryData(
			this.myId,
			this.sortItem,
			this.selectedCountry,
			this.searchBar.value
		);
	}

	showCategoryData(id, sort, country?, text?) {
		this.searchList = [];
		this.loading = true;
		let params: params = {
			link: id,
			limit: this.limit,
			offset: this.offset,
		};
		if (this.filter) {
			this.filter == 'chat' ? (params.is_chat = 1) : (params.is_call = 1);
		}
		params.sort = sort ?? '';
		params.country_id = country?.id ?? '';
		params.name = text ?? '';
		this.filterRequest = this.global.httpPost('consultants', params).subscribe(
			(res) => {
				this.categoryName = res.category?.name;
				this.meta_description = res.category?.meta_description;
				this.countries = [];
				res.countries.map((country) => {
					this.countries.push(country);
				});
				this.countries.unshift({ id: 0, name: 'مشاهده همه' });
				this.loading = false;
				res.consultants.map((item) => {
					
					const list = new Searchitem();
					list.id = item.seo.link;
					list.h1 = item.seo.h1;
					this.h1 = item.seo.h1;
					list.country = item.country;
					list.fullname = item.fullname;
					// list.id = item.id;
					list.image = item.image;
					list.is_online = item.is_online;
					list.prices = [];
					item.prices.map((val) => {
						const price = new Prices();
						price.id = val.id;
						price.is_active = val.is_active;
						price.name = val.name;
						price.price = val.price;
						price.price_extra = val.price_extra;
						price.time = val.time;
						price.type = val.type;
						list.prices.push(price);
					});
					list.rate = item.rate;
					list.title = item.title;
					this.searchList.push(list);
				});
				this.listCount = res.consultant_count;
				if (res.consultant_count == 0) {
					this.global.SSRsetTimeout(() => {
						this.emptyAnimation.goToAndPlay(0);
					}, 500);
				}
				// console.log(res.category['seo']);
				this.setSeo(
					{
						metaTitle: res.category['seo'].title,
						metaDescription: res.category['seo'].description,
						metaKeywords: res.category['seo'].keywords,
						isNoIndex: false

					}
				)
			},
			(err) => {
				this.loading = false;
				this.global.showError(err);
			}
		);
	}

	animateMe() {
		this.state = this.state === 'close' ? 'open' : 'close';
	}

	changeSort(item) {
		this.sortItem = item.value;
		this.filterSubject.next(item);
	}

	onClickBack() {
		if (this.global.isBrowser) {
			window.history.back();

		}
	}

	getFilterText(filter) {
		return filter == 'chat' ?
			'در این قسمت مشاور هایی که گفتگوی متنی آنها فعال است را مشاهده میکنید' :
			filter == 'call' ?
				'در این قسمت مشاور هایی که مشاوره تلفنی آنها فعال باشد را مشاهده میکنید '
				: 'با جستجو در تلفن خونه نزدیک‌ترین و بهترین مشاور مورد نظر خود را پیدا کنید.'
	}



	setSeo(data) {

		this.seo.generateTags({
			title: data.metaTitle,
			description: data.metaDescription,
			keywords: data.metaKeywords,
			image: 'src/assets/img/seo-logo.png',
			isNoIndex: data.isNoIndex,
		});

	}


}

interface params {
	link: string;
	id?: number;
	limit: number;
	offset: number;
	sort?: string;
	country_id?: number;
	name?: string;
	is_chat?: number;
	is_call?: number;
}