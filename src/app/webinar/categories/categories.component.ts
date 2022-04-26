import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonSearchbar, NavController } from '@ionic/angular';
import { Blog, Categories, LatestPosts } from '../../classes/Blog';
import { Seminars } from '../../models/seminars.model';
import { GlobalService } from '../../services/global.service';

@Component({
	selector: 'app-categories',
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {


	@ViewChild('myContent', { static: false }) myContent: IonContent;
	loading = false;
	limit = 9;
	blogSideData = {};
	seminarItems: Seminars[] = [];
	categories: Categories[] = [];
	latest: LatestPosts[] = [];
	offset = 0;
	searchText = '';
	seminarsCount: number;
	p2: 1;
	categoryId: number;
	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/webinar', name: 'وبینار' },
	];

	constructor(private global: GlobalService, private activatedRoute: ActivatedRoute, private navCtrl: NavController) {
	}

	ngOnInit() {
		const id = this.activatedRoute.snapshot.paramMap.get('id');
		this.categoryId = parseInt(id, 10);
		this.getWebinarData(this.searchText, this.categoryId);
	}

	pageChange(ev) {
		this.latest = [];
		this.categories = [];
		this.p2 = ev;
		this.offset = (ev - 1) * this.limit;
		this.getWebinarData(this.searchText, this.categoryId);
	}


	async getWebinarData(search?: string, catId?) {
		if (search) {
			this.searchText = search;
		} else {
			this.searchText = ''
		}
		this.loading = true;
		this.seminarItems = [];
		this.blogSideData = {};
		this.categories = [];
		this.latest = [];
		this.global
			.httpPost('seminars', {
				limit: this.limit,
				offset: this.offset,
				search: search ?? '',
				category_id: catId ?? ''
			})
			.subscribe(
				(res) => {
					this.loading = false;
					//seminarItems is Seminars
					this.seminarsCount = res.seminars_count;
					this.seminarItems = res.seminars.map((seminar: Seminars) =>
						new Seminars().deserialize(seminar)
					);

					res.categories.map((item) => {
						const cat = new Categories();
						cat.entity_count = item.entity_count;
						cat.id = item.id;
						cat.name = item.name;
						this.categories.push(cat);
					});
					res.latest_seminars.map((item) => {
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
							this.getWebinarData();
						}
					});
				}
			);
	}

}
