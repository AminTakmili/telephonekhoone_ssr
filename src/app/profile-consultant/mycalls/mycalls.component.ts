import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { SeoService } from 'src/app/services/seo.service';

@Component({
	selector: 'app-mycalls',
	templateUrl: './mycalls.component.html',
	styleUrls: ['./mycalls.component.scss'],
})
export class MycallsComponent implements OnInit {
	loadMoreLoading = false;
	end = false;
	loading = false;
	showGuideValue = false;
	activeDisable = false;
	activeBtn = 50;
	activeOpacity = 1;
	myCalls: Calls[] = [];
	isMobile = false;
	limit = 10;
	offset = 0;
	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/profile-consultant', name: 'پروفایل مشاور' },
		{ url: '/profile-consultant/mycalls', name: 'مکالمات من' },
	];

	constructor(
		private global: GlobalService,
		private alertController: AlertController,
		mediaMatcher: MediaMatcher,
		private navCtrl: NavController,
		private seo: SeoService,
	) {
		const mediaQueryList = mediaMatcher.matchMedia('(max-width: 768px)');
		this.isMobile = mediaQueryList.matches;
		mediaQueryList.addEventListener('change', (ev) => {
			this.isMobile = ev.matches;
			if (ev.matches) {
				this.navCtrl.navigateRoot('/conversation/mobile');
			} else {
				this.navCtrl.navigateRoot('/conversation');
			}
		});
	}

	ngOnInit() {
		this.setSeo(
			{
				metaTitle: 'مکالمات من',
				isNoIndex: true
			}
		)
	}

	ionViewWillEnter() {
		this.getCallsData(false);
		this.setSeo(
			{
				metaTitle: 'مکالمات من',
				isNoIndex: true
			}
		)
	}

	setSeo(data) {
		console.log(data);
		this.seo.generateTags({
			title: data.metaTitle,
			description: data.metaDescription,
			canonical: data.canonicalLink,
			// keywords: data.metaKeywords.toString(),
			image: '/assets/img/icon/icon-384x384.png',
			isNoIndex: data.isNoIndex,
		});

	}

	pressed(event, item) {
		event.preventDefault();
		if (!item.loading) {
			this.showGuideValue = true;
		}
	}

	active(item) {
		if (this.activeBtn == 0 && !this.activeDisable && !item.loading) {
			this.acceptCall(item);
		} else if (this.activeBtn > 0 && !this.activeDisable) {
			this.activeBtn -= 10;
			this.activeOpacity -= 0.2;
		}
	}

	showGuide(item) {
		if (!item.loading) {
			this.showGuideValue = true;
			setTimeout(() => {
				this.showGuideValue = false;
			}, 1000);
		}
	}

	released() {
		if (!this.activeDisable) {
			this.activeBtn = 50;
			this.activeOpacity = 1;
		}
		this.showGuideValue = false;
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
							calls.user = item.user;
							calls.accepted = false;
							calls.rejected = false;
							calls.loading = false;
							calls.chat = item.chat;

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

	acceptCall(item) {
		this.activeDisable = true;
		this.setWidth('accepted', item);
		const req = item.status == 'pending' ? 'acceptCall' : 'makeCall';
		item.loading = true;
		this.global
			.httpPost(req, {
				id: item.id,
			})
			.subscribe(
				(res) => {
					item.loading = false;
					this.global.showToast(res.msg, 2000, 'top');
					item.status = res.status;
					item.status_text = res.status_text;
					this.setWidth('reset', item);
				},
				(err) => {
					item.loading = false;
					this.global.showError(err);
					this.setWidth('reset', item);
				}
			);
	}

	async rejectCall(item) {
		this.setWidth('rejected', item);

		const alertHeader = item.status == 'accepted' ? 'لغو تماس' : 'رد تماس';

		const alert = await this.alertController.create({
			header: `${alertHeader}`,
			message: `برای ${alertHeader} اطمینان دارید ؟`,
			inputs: [
				{
					name: 'description',
					id: 'description',
					type: 'textarea',
					placeholder: 'توضیحات لغو درخواست',
				},
			],
			buttons: [
				{
					text: 'بله لغو شود',
					handler: (data) => {
						if (data.description) {
							item.loading = true;
							this.global
								.httpPost('declineCall', {
									id: item.id,
									description: data.description,
								})
								.subscribe(
									(res) => {
										item.loading = false;
										this.global.showToast(res.msg, 2000, 'top');
										item.status = res.status;
										item.status_text = res.status_text;
										this.setWidth('reset', item);
									},
									(err) => {
										item.loading = false;
										this.global.showError(err);
										this.setWidth('reset', item);
									}
								);
						} else {
							this.global.showToast(
								'توضیحات لغو درخواست ضروری است',
								2000,
								'top',
								'damger'
							);
							return false;
						}
					},
				},
				{
					text: 'خیر',
					role: 'cancel',
					handler: () => {
						this.setWidth('reset', item);
					},
				},

			],
			cssClass: 'customAlert'
		});

		await alert.present();
	}

	setWidth(mode, item?) {
		switch (mode) {
			case 'accepted':
				this.activeBtn = 0;
				this.activeOpacity = 0;
				this.activeDisable = false;
				if (item) {
					item.rejected = false;
					item.accepted = true;
				}
				break;
			case 'rejected':
				if (item) {
					item.rejected = true;
					item.accepted = false;
				}
				break;
			case 'reset':
				this.activeBtn = 50;
				this.activeOpacity = 1;
				if (item) {
					item.rejected = false;
					item.accepted = false;
				}
				break;
		}
	}

	getStatusColor(status) {
		return status == 'pending'
			? 'primary'
			: status == 'accepted'
				? 'success'
				: status == 'onCall'
					? 'secondary'
					: status == 'ended'
						? 'medium'
						: 'danger'
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

	openChat(item) {

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
	user: string;
	accepted: boolean;
	rejected: boolean;
	loading: boolean;
	chat: any;
}
