import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Seminars } from 'src/app/models/seminars.model';
import { GlobalService } from 'src/app/services/global.service';
import { Meta, Title } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SeoService } from 'src/app/services/seo.service';

@Component({
	selector: 'app-show',
	templateUrl: './show.component.html',
	styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
	loading = false;
	seminarId: string;
	isReserved = false;
	seminarDetail: Seminars;
	breadCrumb = [
		{ url: '/', name: 'تلفن خونه' },
		{ url: '/webinar', name: 'وبینار' },
	];

	constructor(
		private global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private meta: Meta,
		private title: Title,
		private iab: InAppBrowser,
		public seo: SeoService,

	) {
	}

	ngOnInit() {
		const id = this.activatedRoute.snapshot.paramMap.get('id');
		this.seminarId = id;
		this.getData(id);
	}

	getData(id) {
		this.global.showLoading().then(() => {
			this.loading = true;
			this.global
				.httpPost('seminars/show', {
					link: id,
				})
				.subscribe(
					(res) => {
						this.global.dismisLoading()
						this.seminarDetail = new Seminars().deserialize(res.seminar);
						// this.meta.addTags([
						// 	{ name: 'keywords', content: this.seminarDetail.meta_keywords },
						// 	{ name: 'title', content: this.seminarDetail.meta_title },
						// 	{
						// 		name: 'description',
						// 		content: this.seminarDetail.meta_description,
						// 	},
						// 	{ name: 'robots', content: 'index, follow' },
						// ]);
						// this.title.setTitle(this.seminarDetail.title + ' | ' + 'تلفن خونه');
						this.isReserved = res.seminar.is_reserved;
						this.loading = false;

						this.setSeo(
							{
							  metaTitle:res.seminar.seo.title,
							  metaDescription:res.seminar.seo.description,
							  metaKeywords:res.seminar.seo.keywords,
							  isNoIndex:false

							}
							)
							this.breadCrumb = [
								{ url: '/', name: 'تلفن خونه' },
								{ url: '/webinar', name: 'وبینار' },
								{ url: `/webinar/${res.seminar.seo.link}`,name:  'وبینار '+res.seminar.title },
							];
					},
					(err) => {
						this.global.dismisLoading()
						this.loading = false;
						this.global.showError(err).then((data) => {
							if (data == 'req') {
								this.getData(this.seminarId);
							}
						});
					}
				);
		});
	}

	setSeo(data) {

        this.seo.generateTags({
            title: data.metaTitle,
            description: data.metaDescription,
            canonical: data.canonicalLink,
            keywords: data.metaKeywords.toString(),
            image: data.img,
            isNoIndex: data.isNoIndex,
        });

    }
	reserveSeminar() {
		this.global.showLoading().then(() => {
			this.global
				.httpPost('seminars/reserve', {
					link: this.seminarId,
					back_url: this.global.siteUrl
				})
				.subscribe(
					(res) => {

						this.global.dismisLoading()
						this.global.showToast(res.msg, 2000, 'top');
						if (res.link) {
							this.iab.create(res.link, '_self');
						}
						this.setSeo(
							{
							  metaTitle:res.seo.title,
							  metaDescription:res.seo.description,
							  metaKeywords:res.seo.keywords,
							  isNoIndex:false

							}
							)
							this.breadCrumb = [
								{ url: '/', name: 'تلفن خونه' },
								{ url: '/webinar', name: 'وبینار' },
								{ url: `/webinar/${res.seo.link}`, name: res.seo.title },
							];
					},
					(err) => {
						this.global.dismisLoading()
						this.global.showError(err);
					}
				);
		});
	}
}
