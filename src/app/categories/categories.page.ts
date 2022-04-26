import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { Categories, Consultants } from '../classes/Categories';
import { GlobalService } from '../services/global.service';
import * as searchAnimation from '../../assets/animations/13525-empty.json';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/c', name: 'دسته بندی' },
	];
	loading = false;
	galleryThumbsConfig2 = {
		spaceBetween: 20,
		slidesPerView: 'auto',
		freeModeSticky: true,
		freeMode: true,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
	};
	emptyAnimation: any;
	searchAnimate: AnimationOptions = {
		animationData: searchAnimation['default'],
		loop: false,
		autoplay: false,
	};
	categoryId: number|string|undefined;
	selectedId: number;
	categoryItems = [];
	categories: Categories[] = [];
	subCategories: Categories[] = [];
	newAllCatObj:Categories[]
	constructor(
		private global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private navCtrl: NavController,
		private activateRoute: ActivatedRoute,
		private router: Router
	) { }

	ngOnInit() {
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
			
			this.categoryId =this.activatedRoute.snapshot.paramMap.get('catId')
		}else{
			this.categoryId ='all'
		}
		const filterUrl = this.activatedRoute.snapshot.paramMap.get('filter');
		// console.log(this.activatedRoute.snapshot.paramMap.get('catId'));
		// this.route.snapshot.paramMap.get('businessId');
		// this.setActiveId(this.activatedRoute.snapshot.paramMap.get('catId'))

		this.getData(filterUrl);
		this.addAllCat()
	 }

	handleEmptyAnimation(anim: any) {
		this.emptyAnimation = anim;
	}

	ionViewWillEnter() {
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
			
			this.categoryId =this.activatedRoute.snapshot.paramMap.get('catId')
		}else{
			this.categoryId ='all'
		}
		const filterUrl = this.activatedRoute.snapshot.paramMap.get('filter');
		// console.log(this.activatedRoute.snapshot.paramMap.get('catId'));
		// this.route.snapshot.paramMap.get('businessId');
		// this.setActiveId(this.activatedRoute.snapshot.paramMap.get('catId'))

		this.getData(filterUrl);
		this.addAllCat()
	}

	getData(filter?: string) {
		this.loading = true;
		if (filter) {
			const reqBody = {};
			filter == 'chat'
				? (reqBody['is_chat'] = 1)
				: (reqBody['is_call'] = 1);
			this.global.httpPost('categories', reqBody).subscribe(
				(res) => {
					this.loading = false;
					console.log(res);
					res.map((item, index) => {
						const cat = new Categories();
						cat.id = item.id;
						cat.name = item.name;
						cat.children = item.children;
						if (index == 0) {
							cat.active = true;
							this.categoryItems = item.children;
						}
						if (this.categories.findIndex(item => item.id ==cat.id)==-1) {
							
							this.categories.push(cat)
						}
						
					});
					if (this.categoryItems.length == 0) {
						setTimeout(() => {
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
					this.loading = false;
					res.map((item, index) => {
						const cat = new Categories();
						cat.id = item.id;
						cat.name = item.name;
						cat.children = item.children;
						if (this.categories.findIndex(item => item.id ==cat.id)==-1) {
							
							this.categories.push(cat)
						}
						
					});
					if (this.categoryId) {
						this.setActiveId(this.categoryId);
					} else {
						this.changeActiveCategory(this.newAllCatObj[0].id);
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
		}
		this.addAllCat()
		// this.setActiveId(this.activatedRoute.snapshot.paramMap.get('catId'))

	}
	// imageLoad(ev) {
	//     ev;
	// }

	changeActiveCategory(id) {
		// console.log(id);
		if (id) {
			this.router.navigate(['c/'+id]);
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
		}else{
			this.router.navigate(['c'])

		}
		this.addAllCat()
	}

	setActiveId(id) {
		this.addAllCat()
		let selectedCategory
		if (id=='all') {
			
			 selectedCategory = this.newAllCatObj.find(item => item.name =='همه');
			 

		}else{

			this.selectedId = id;
			 selectedCategory = this.newAllCatObj.find(item => item.id == parseInt(id, 10));
		}
		// if (id) {

		// }
		// this.selectedId = id;
		// const selectedCategory = this.categories.find(item => item.name == 'همه');
		// console.log(selectedCategory);
		this.categoryItems = selectedCategory.children;
		if (this.categoryItems.length == 0) {
			setTimeout(() => {
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
					console.log(res,"sub");
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
	addAllCat(){
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
		this.newAllCatObj=[]
		let newCatobj = new Categories();
		let newCatobjChilderen =[];
					
					
		this.categories.map(
			(item)=>{
				// console.log(item['_children']);
				// console.log(item.children);
				newCatobjChilderen.push(...item.children)

			}
		)
		// newCatobj.name="همه"
		// newCatobj.id="all"
		newCatobj.name ="همه";
		// newCatobj.id =0;
		// newCatobj.id =;
		newCatobj.children =newCatobjChilderen
		if (!this.activatedRoute.snapshot.paramMap.get('catId')) {
			this.categoryItems = newCatobj.children;
		}
		this.newAllCatObj=[newCatobj,...this.categories]

		// console.log(newCatobj);
		// console.log(this.newAllCatObj);
		// console.log(newCatobj.children);
		// console.log(this.newAllCatObj[0]);


	}

}
