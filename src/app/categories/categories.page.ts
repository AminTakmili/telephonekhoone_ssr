import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { Categories, Consultants } from '../classes/Categories';
import { GlobalService } from '../services/global.service';
import * as searchAnimation from '../../assets/animations/13525-empty.json';
import { NavController } from '@ionic/angular';
import { SeoService } from '../services/seo.service';

@Component({
	selector: 'app-categories',
	templateUrl: './categories.page.html',
	styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
	breadCrumb = [
		{ url: '/', name: 'تلفن خونه' },
		{ url: '/consultation', name: 'دسته بندی' },
	];

	currentCategory : any;
	loading = false;
	galleryThumbsConfig2 = {
		spaceBetween: 20,
		slidesPerView: 'auto',
		freeModeSticky: true,
		freeMode: true,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
	};
	mainSeoObj: object = {
		description: "مشاوره های تلفن خونه",
		keywords: " همه مشاوران ",
		title: " همه مشاوران ",
	};
	emptyAnimation: any;
	searchAnimate: AnimationOptions = {
		animationData: searchAnimation['default'],
		loop: false,
		autoplay: false,
	};
	categoryId: number | string | undefined;
	selectedId: number;
	categoryItems = [];
	categories: Categories[] = [];
	subCategories: Categories[] = [];
	newAllCatObj: Categories[]
	constructor(
		private global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private navCtrl: NavController,
		private activateRoute: ActivatedRoute,
		private router: Router,
		public seo: SeoService,

	) { }

	async ngOnInit() {
		this.categoryId = undefined;
		this.categories = [];
		this.categoryItems = [];
		this.newAllCatObj = [];
		// this.activateRoute.queryParams.subscribe(res => {
		// 	this.categoryId = parseInt(res.id, 10);
		// 	if (this.categories.length > 0 && res.id) {
		// 		this.setActiveId(res.id);
		// 	}
		// });
		if (this.activatedRoute.snapshot.paramMap.get('catId')) {

			this.categoryId = this.activatedRoute.snapshot.paramMap.get('catId')
		} else {
			this.categoryId = 'all'
		}
		const filterUrl = this.activatedRoute.snapshot.paramMap.get('filter');
		// console.log(this.activatedRoute.snapshot.paramMap.get('catId'));
		// this.route.snapshot.paramMap.get('businessId');
		// this.setActiveId(this.activatedRoute.snapshot.paramMap.get('catId'))

		await this.getData(filterUrl);
		await this.addAllCat()
		// this.chengeSeoData()
	}

	handleEmptyAnimation(anim: any) {
		this.emptyAnimation = anim;
	}

	async ionViewWillEnter() {
		this.categoryId = undefined;
		this.categories = [];
		this.categoryItems = [];
		this.newAllCatObj = [];
		// this.activateRoute.queryParams.subscribe(res => {
		// 	this.categoryId = parseInt(res.id, 10);
		// 	if (this.categories.length > 0 && res.id) {
		// 		this.setActiveId(res.id);
		// 	}
		// });
		if (this.activatedRoute.snapshot.paramMap.get('catId')) {

			this.categoryId = this.activatedRoute.snapshot.paramMap.get('catId')
		} else {
			this.categoryId = 'all'
		}
		const filterUrl = this.activatedRoute.snapshot.paramMap.get('filter');
		// console.log(this.activatedRoute.snapshot.paramMap.get('catId'));
		// this.route.snapshot.paramMap.get('businessId');
		// this.setActiveId(this.activatedRoute.snapshot.paramMap.get('catId'))

		await this.getData(filterUrl);
		await this.addAllCat()
		// this.chengeSeoData()
	}

	async getData(filter?: string) {
		this.loading = true;
		if (filter) {
			const reqBody = {};
			filter == 'chat'
				? (reqBody['is_chat'] = 1)
				: (reqBody['is_call'] = 1);
			this.global.httpPost('categories', reqBody).subscribe(
				(res) => {
					this.loading = false;
					// console.log(res);
					res.map((item, index) => {
						const cat = new Categories();
						cat.id = item.id;
						cat.name = item.name;
						cat.children = item.children.map((child: any) => {
							child['parent_id'] = item.id;
							return child;
						});
						if (index == 0) {
							cat.active = true;
							this.categoryItems = item.children.map((child: any) => {
								child['parent_id'] = item.id;
								return child;
							});
						}
						if (this.categories.findIndex(item => item.id == cat.id) == -1) {

							this.categories.push(cat)
						}


					});

					if (this.categoryItems.length == 0) {
						this.global.SSRsetTimeout(() => {
							this.emptyAnimation.goToAndPlay(0);
						}, 500);
					}
				},
				(err) => {
					this.loading = false;
					this.global.showError(err).then((x) => {
						if (x == 'req') {
							this.getData();
						}
					});
				}
			);
		} else {
			this.global.httpGet('categories').subscribe(
				(res) => {
					// console.log(res);
					this.loading = false;
					res.map((item, index) => {
						// console.log(item);
						// console.log(item.name);
						// console.log(item.seo);
						const cat = new Categories();
						cat.id = item.id;
						cat.name = item.name;
						cat.setSeo = item.seo;
						cat.children = item.children.map((child: any) => {
							child['parent_id'] = item.id;
							return child;
						});
						if (this.categories.findIndex(item => item.id == cat.id) == -1) {

							this.categories.push(cat)
						}

					});
					// console.log(this.categories);
					if (this.categoryId) {
						this.setActiveId(this.categoryId);
					} else {
						this.changeActiveCategory(this.newAllCatObj[0].seo['link']);
					}
					if (this.activatedRoute.snapshot.paramMap.get('catId')) {

						// console.log(res);
						this.currentCategory = res.find((item) => {
							return item.seo['link'] == this.activatedRoute.snapshot.paramMap.get('catId')
						})
						 console.log(this.currentCategory);

						this.breadCrumb = [
							{ url: '/', name: 'تلفن خونه' },
							{ url: '/consultation/' + this.activatedRoute.snapshot.paramMap.get('catId'), name: `${this.currentCategory['name']}` },
						];
					}
					this.chengeSeoData(res)
				},
				(err) => {
					this.loading = false;
					if (err.status === 400 && err.error.data['redirectUrl']) {
						this.seo.redirect(err.error.data['redirectUrl']);
						return;
					} else {
						this.global.showError(err).then((x) => {
							if (x == 'req') {
								this.getData();
							}
						});;
					}
				}
			);
		}

		// this.chengeSeoData()
		// this.setActiveId(this.activatedRoute.snapshot.paramMap.get('catId'))

	}
	// imageLoad(ev) {
	//     ev;
	// }

	changeActiveCategory(id) {
		// console.log(id);
		if (id) {
			this.router.navigate(['c/' + id]);
			// this.router.navigate([decodeURI(id)]);
			// this.router.navigateByUrl(id, { skipLocationChange: true });
			// this.router.navigate(
			// 	['/id'],
			// 	// {
			// 	// 	relativeTo: this.activateRoute,
			// 	// 	queryParams: { id: id },
			// 	// 	queryParamsHandling: 'merge'
			// 	// }
			// 	);
		} else {
			this.router.navigate(['c'])

		}
		this.addAllCat()
	}

	setActiveId(id) {

		this.addAllCat()
		let selectedCategory
		if (id == 'all') {

			selectedCategory = this.newAllCatObj.find(item => item.name == 'همه');


		} else {
			// parseInt(id, 10)
			// console.log(id);
			this.selectedId = id;
			selectedCategory = this.newAllCatObj.find(item => item.seo['link'] == id);
			//  console.log(selectedCategory);
		}
		// if (id) {

		// }
		// this.selectedId = id;
		// const selectedCategory = this.categories.find(item => item.name == 'همه');
		// console.log(selectedCategory);
		this.categoryItems = selectedCategory.children;
		if (this.categoryItems.length == 0) {
			this.global.SSRsetTimeout(() => {
				this.emptyAnimation.goToAndPlay(0);
			}, 500);
		}
	}

	showCategoryData(id) {
		this.loading = true;
		this.global
			.httpPost('categories', {
				id: id,
			})
			.subscribe(
				(res) => {
					// console.log(res,"sub");
					this.loading = false;
					res.list.map((item) => {
						const cat = new Categories();
						cat.id = item.id;
						cat.name = item.name;
						cat.parent = item.parent == 1 ? true : false;
						cat.active = false;
						cat.media = item.media[0].options.subSizes;
						cat.consultants = [];
						item.consultants.map((value) => {
							const consultant = new Consultants();
							consultant.id = value.id;
							consultant.media = value.options?.subSizes;
							cat.consultants.push(consultant);
						});
						this.subCategories.push(cat);
					});
				},
				(err) => {
					this.loading = false;
					this.global.showError(err);
				}
			);
	}
	onRate(ev) {
	}
	async addAllCat() {
		// console.log(this.categoryItems);
		// console.log(this.categories);
		// let newCatobj:{
		// 	children:Array<object>,
		// 	name:string,
		// 	id:string|number
		// }={
		// 	children:[],
		// 	name:'',
		// 	id:''
		// }
		this.newAllCatObj = []
		let newCatobj = new Categories();
		let newCatobjChilderen = [];


		this.categories.map(
			(item) => {
				// console.log(item['_children']);
				// console.log(item.children);
				newCatobjChilderen.push(...item.children)

			}
		)
		// newCatobj.name="همه"
		// newCatobj.id="all"
		newCatobj.name = "همه";
		newCatobj.setSeo = this.mainSeoObj
		// link: " همه-مشاوران ",
		// newCatobj.id =0;
		// newCatobj.id =;
		newCatobj.children = newCatobjChilderen
		if (!this.activatedRoute.snapshot.paramMap.get('catId')) {
			this.categoryItems = newCatobj.children;
		}

		this.newAllCatObj = [newCatobj, ...this.categories]

		// console.log(...this.categories);
		// console.log(newCatobj);
		// console.log(this.newAllCatObj);
		// this.chengeSeoData(this.newAllCatObj)
		// console.log(newCatobj.children);
		// console.log(this.newAllCatObj[0]);


	}

	// setSeo(data) {

	// 	this.seo.generateTags({
	// 		title: data.metaTitle,
	// 		description: data.metaDescription,
	// 		keywords: data.metaKeywords,
	// 		image: 'src/assets/img/seo-logo.png',
	// 		isNoIndex: data.isNoIndex,
	// 	});

	//   }
	async chengeSeoData(data) {
		// await this.addAllCat()
		// console.log(data);
		// if (this.activatedRoute.snapshot.paramMap.get('catId')) {
		let seoObj
		// console.log(this.categories);
		// console.log(this.newAllCatObj[0]);
		// console.log(this.newAllCatObj[0]['seo']);
		// console.log(this.newAllCatObj[0]['seo']['link']);
		// console.log(this.activatedRoute.snapshot.paramMap.get('catId'));

		// ?this.activatedRoute.snapshot.paramMap.get('catId')? seoObj=	this.newAllCatObj.find(item=>item.seo['link']==this.activatedRoute.snapshot.paramMap.get('catId')):seoObj=this.newAllCatObj[0];

		if (this.activatedRoute.snapshot.paramMap.get('catId')) {
			// console.log(	this.categories);
			// seoObj = this.categories.find( ({ name }) => name === 'cherries' );
			seoObj = data.find(item => item.seo['link'] == this.activatedRoute.snapshot.paramMap.get('catId')).seo
			console.log(seoObj);
		} else {
			// console.log(this.newAllCatObj[0]);
			seoObj = this.mainSeoObj
			console.log(seoObj);

		}
		// seoObj=	this.newAllCatObj.find((item)=>{
		// 	return item['seo']['link']==this.activatedRoute.snapshot.paramMap.get('catId')
		// })
		// console.log(seoObj.seo);
		// console.log(seoObj);
		// console.log({
		// 	title:seoObj.seo.title,
		// 	description: seoObj.seo.description,
		// 	keywords:  seoObj.seo.keywords,
		// 	image: 'src/assets/img/seo-logo.png',
		// 	isNoIndex: false,
		// });


		this.seo.generateTags({
			title: seoObj.title,
			description: seoObj.description,
			keywords: seoObj.keywords,
			image: 'src/assets/img/seo-logo.png',
			isNoIndex: false,
		});



		// }else{
		// 	this.categoryId ='all'
		// }

	}


}
