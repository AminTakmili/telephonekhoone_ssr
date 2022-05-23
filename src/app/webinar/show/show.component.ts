import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Seminars } from 'src/app/models/seminars.model';
import { GlobalService } from 'src/app/services/global.service';
import { Meta, Title } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

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
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/webinar', name: 'وبینار' },
	];

	constructor(
		private global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private meta: Meta,
		private title: Title,
		private iab: InAppBrowser
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
						this.meta.addTags([
							{ name: 'keywords', content: this.seminarDetail.meta_keywords },
							{ name: 'title', content: this.seminarDetail.meta_title },
							{
								name: 'description',
								content: this.seminarDetail.meta_description,
							},
							{ name: 'robots', content: 'index, follow' },
						]);
						this.title.setTitle(this.seminarDetail.title + ' | ' + 'تلفن خونه');
						this.isReserved = res.seminar.is_reserved;
						this.loading = false;
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
					},
					(err) => {
						this.global.dismisLoading()
						this.global.showError(err);
					}
				);
		});
	}
}
