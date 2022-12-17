import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { SurveyComponent } from 'src/app/module/share-module/survey/survey.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SeoService } from 'src/app/services/seo.service';

@Component({
	selector: 'app-my-calls',
	templateUrl: './my-calls.component.html',
	styleUrls: ['./my-calls.component.scss'],
})
export class MyCallsComponent implements OnInit {
	loading = false;
	myCalls: Calls[] = [];
	end = false;
	payLoading = false;
	limit = 10;
	offset = 0;
	loadMoreLoading = false;
	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/profile', name: 'پروفایل' },
		{ url: '/profile/mycalls', name: 'مکالمات من' },
	];

	constructor(private global: GlobalService,
		private iab: InAppBrowser,
		private modalController: ModalController,
		public seo: SeoService,

	) {
	}

	ngOnInit() {
		this.setSeo(
			{
				metaTitle: 'مکالمات من',
				metaDescription: 'مکالمات من در تلفن خونه',
				metaKeywords: 'مکالمات من,مکالمات من تلفن خونه, مکالمات من ',
				isNoIndex: true
			}
		)
	}

	ionViewWillEnter() {
		this.getCallsData(false);
		this.setSeo(
			{
				metaTitle: 'مکالمات من',
				metaDescription: 'مکالمات من در تلفن خونه',
				metaKeywords: 'مکالمات من,مکالمات من تلفن خونه, مکالمات من ',
				isNoIndex: true
			}
		)

	}
	setSeo(data) {
		// console.log(data);
		this.seo.generateTags({
			title: data.metaTitle,
			description: data.metaDescription,
			canonical: data.canonicalLink,
			// keywords: data.metaKeywords.toString(),
			image: '/assets/img/icon/icon-384x384.png',
			isNoIndex: data.isNoIndex,
		});

	}


	async showSurvey(item) {
		const modal = await this.modalController.create({
			component: SurveyComponent,
			cssClass: 'survey-modal',
			componentProps: { id: item.id, type: 1 }
		});
		await modal.present();
		modal.onDidDismiss().then(data => {
			if (data.data == 'refresh') {
				this.limit = 10;
				this.offset = 0;
				this.getCallsData(false);
			}
		})
	}

	getCallsData(isLoadMore): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			if (!isLoadMore) {
				this.loading = true;
				this.myCalls = [];
				this.offset = 0;
				this.end = false;
			} else {
				this.loadMoreLoading = true;
			}
			this.global
				.httpPost('calls', {
					limit: this.limit,
					offset: this.offset,
				})
				.subscribe(
					(res) => {
						res.calls.map((item) => {
							const calls = {} as Calls;
							calls.can_rate = item.can_rate;
							calls.category = item.category;
							calls.consultant = item.consultant;
							calls.created_at = item.created_at;
							calls.id = item.id;
							calls.status = item.status;
							calls.status_text = item.status_text;
							calls.user_plan_id = item.user_plan_id;
							calls.consultant_image = item.consultant_image;
							this.myCalls.push(calls);
						});
						if (!isLoadMore) {
							this.loading = false;
						}
						if (res.calls.length < this.limit) {
							this.end = true;
						}
						resolve('');
					},
					(err) => {
						this.loadMoreLoading = false;
						this.loading = false;
						this.global.showError(err);
						reject('');
					}
				);
		});

	}

	loadMore() {
		if (this.end === false) {
			this.offset += this.limit;
			this.getCallsData(true).then(() => {
				this.loadMoreLoading = false;
			});
		} else {
			this.loadMoreLoading = false;
		}
	}
	goPay(item) {
		this.payLoading = true;
		this.global.httpPost('payCall', {
			id: item.id,
			back_url: this.global.backUrl
		}).subscribe(res => {
			this.payLoading = false;
			this.iab.create(
				res.link,
				'_self'
			);
		}, err => {
			this.payLoading = false;
			this.global.showError(err);
		});
	}
}

interface Calls {
	can_rate: boolean;
	category: string;
	consultant: string;
	created_at: string;
	id: number;
	status: string;
	status_text: string;
	user_plan_id: number;
	consultant_image: any;
}
