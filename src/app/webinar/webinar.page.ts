import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController } from '@ionic/angular';
import { Blog, Categories, LatestPosts } from '../classes/Blog';
import { Seminars } from '../models/seminars.model';
import { GlobalService } from '../services/global.service';
import { SeoService } from '../services/seo.service';

@Component({
	selector: 'app-webinar',
	templateUrl: './webinar.page.html',
	styleUrls: ['./webinar.page.scss'],
})
export class WebinarPage implements OnInit {
	@ViewChild('myContent', { static: false }) myContent: IonContent;
	loading = false;
	limit = 9;
	blogSideData = {};
	seminarItems: Seminars[] = [];
	categories: Categories[] = [];
	latest: LatestPosts[] = [];
	offset = 0;
	seminarsCount: number;
	p2: 1;
	breadCrumb = [
		{ url: '/', name: 'تلفن خونه' },
		{ url: '/webinar', name: 'وبینار' },
	];

	constructor(
		private global: GlobalService,
		private navCtrl: NavController,
		public seo: SeoService,


		) {
	}

	ngOnInit() {
		this.getWebinarData();
		this.setSeo(
            {
              metaTitle:'وبینارهای',
              metaDescription:'وبینار تلفن خونه',
              metaKeywords:'وبینارهای,وبینارهای تلفن خونه, وبینارهای مشاوره',
              isNoIndex:false

            }
            )
	}
	ionViewWillEnter() {
		// console.log("object");

        this.setSeo(
            {
              metaTitle:'وبینارهای',
              metaDescription:'وبینار تلفن خونه',
              metaKeywords:'وبینارهای,وبینارهای تلفن خونه, وبینارهای مشاوره',
              isNoIndex:false

            }
            )
      }

	pageChange(ev) {
		this.latest = [];
		this.categories = [];
		this.p2 = ev;
		this.offset = (ev - 1) * this.limit;
		this.getWebinarData();
	}


	async getWebinarData(search?: string, catId?) {
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
	setSeo(data) {
  		// console.log(data);
        this.seo.generateTags({
            title: data.metaTitle,
            description: data.metaDescription,
            canonical: data.canonicalLink,
            keywords: data.metaKeywords.toString(),
            image: '/assets/img/icon/icon-384x384.png',
            isNoIndex: data.isNoIndex,
        });

    }

}
