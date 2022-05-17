import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { Blog, Categories, LatestPosts } from '../../classes/Blog';
import { GlobalService } from '../../services/global.service';

@Component({
	selector: 'app-categories',
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.scss'],
})
export class BlogCategoriesComponent implements OnInit {


	@ViewChild('myContent', { static: false }) myContent: IonContent;
	loading = false;
	limit = 9;
	blogSideData = {};
	blogItems: Blog[] = [];
	categories: Categories[] = [];
	latest: LatestPosts[] = [];
	offset = 0;
	blogsCount: number;
	searchText = '';
	categoryId: number;
	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/b', name: 'بلاگ' },
	];
	p2: 1;

	constructor(private global: GlobalService, private navCtrl: NavController , private activatedRoute: ActivatedRoute) {
	}

	ngOnInit() {
		const id = this.activatedRoute.snapshot.paramMap.get('id');
		this.categoryId = parseInt(id, 10);
		this.getData(this.searchText, this.categoryId);
	}

	pageChange(ev) {
		this.blogItems = [];
		this.latest = [];
		this.categories = [];
		this.p2 = ev;
		this.offset = (ev - 1) * this.limit;
		this.getData(this.searchText, this.categoryId);
	}

	getData(search?: string, catId?) {
		if (search) {
			this.searchText = search;
		} else {
			this.searchText = ''
		}
		this.loading = true;
		this.blogSideData = {};
		this.categories = [];
		this.latest = [];

		//req data from API by POST method
		this.global
			.httpPost('blog', {
				limit: this.limit,
				offset: this.offset,
				search: search ?? '',
				category_id: catId ?? ''
			})
			.subscribe(
				(res) => {
					this.loading = false;
					//blogItems is Blog()
					this.blogsCount = res.blogs_count;
					res.blogs.map((item) => {
						const items = new Blog();
						items.admin = item.admin;
						items.created_at = item.created_at;
						items.id = item.id;
						items.title = item.title;
						if (item.media[0]) {
							items.media = item.media[0].options?.subSizes.large ?? item.media[0].path;
						} else {
							items.media = 'assets/img/no-image.jpg';
						}
						this.blogItems.push(items);
					});
					// Blog categories is Categories()
					res.categories.map((item) => {
						const cat = new Categories();
						cat.entity_count = item.entity_count;
						cat.id = item.id;
						cat.name = item.name;
						this.categories.push(cat);
					});
					res.latest.map((item) => {
						const latest = new LatestPosts();
						latest.created_at = item.created_at;
						latest.id = item.id;
						latest.title = item.title;
						if (item.media[0]) {
							latest.media = item.media[0].options?.subSizes.medium ?? item.media[0].path;
						}
						this.latest.push(latest);
					});
					this.blogSideData = {
						categories: this.categories,
						latest: this.latest,
					};
					this.myContent.scrollToTop(200);
				},
				(err) => {
					this.loading = false;
					this.global.showError(err).then((data) => {
						if (data == 'req') {
							this.getData();
						}
					});
				}
			);
	}

	blogDetail(item) {
		this.navCtrl.navigateForward(`/b/${item.id}`);
	}
}
