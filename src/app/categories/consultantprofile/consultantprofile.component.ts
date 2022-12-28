import {
	AlertController,
	ModalController,
	NavController,
	ToastController,
} from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import {
	Consultant,
	ConsultantPlanPrice,
	Days,
	Price,
	Timeline,
} from 'src/app/classes/Consultant';
//! import { NewChatComponent } from 'src/app/categories/dr-profile/new-chat/new-chat.component';
import { animate, style, transition, trigger } from '@angular/animations';

import { ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { GlobalService } from 'src/app/services/global.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NewChatComponent } from './new-chat/new-chat.component';
import { SeoService } from 'src/app/services/seo.service';
import { Storage } from '@ionic/storage';
import { TimelineComponent } from 'src/app/components/timeline/timeline.component';
import { UserBalanceService } from 'src/app/services/user-balance.service';
import { WalletComponent } from 'src/app/components/wallet/wallet.component';

// import { time, timeline } from "console";


@Component({
	selector: 'app-consultantprofile',
	templateUrl: './consultantprofile.component.html',
	styleUrls: ['./consultantprofile.component.scss'],
})
export class ConsultantprofileComponent implements OnInit {
	myId;
	catId;
	plan_id;
	timeEx = false;
	waitTime: any;
	interval: any;
	timeline: Timeline[] = [];
	favLoading = false;
	comments_count = 0;
	comments = [];
	consultant_name = '';
	details: Consultant;
	consultantSelf = false;
	chatLoading = false;
	loading = false;
	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/', name: `درباره مشاور` },
	];

	constructor(
		private activatedRoute: ActivatedRoute,
		private global: GlobalService,
		private alertController: AlertController,
		private balanceService: UserBalanceService,
		private modalController: ModalController,
		private iab: InAppBrowser,
		private toastController: ToastController,
		private navCtrl: NavController,
		private storage: Storage,
		private _decimalPipe: DecimalPipe,
		public seo: SeoService,

	) { }

	ngOnInit() {
		console.log(this.navCtrl);
		this.catId = this.activatedRoute.snapshot.paramMap.get('subCatId');
		this.myId = this.activatedRoute.snapshot.paramMap.get('consultantId');

		if (this.global.getUserInfo() && parseInt(this.myId, 10) === this.global.getUserInfo()?.id) {
			this.consultantSelf = true;
		} else {
			this.consultantSelf = false;
		}
		this.getData();
	}

	getData() {
		this.loading = true;

		this.global.showLoading().then(() => {
			// this.global.dismisLoading();
			this.global
				.httpPost('consultant/show', {
					link: this.myId,
					category_item_link: this.catId,
				})
				.subscribe(
					(res) => {
						this.loading = false;
						this.plan_id = res.plan.id;
						const consultant = new Consultant();
						consultant.category = res.category;
						consultant.country = res.country;
						consultant.consultantPlan_price = [];
						consultant.consultantPlan_category =
							res.consultantPlan_category;
						consultant.consultantPlan_id = res.plan.id;
						consultant.consultantPlan_timeline = [];
						consultant.consultant_id = res.consultant_id;
						consultant.plan_min_price_call =
							res.plan.min_price_call;
						consultant.plan_min_price_chat =
							res.plan.min_price_chat;
						consultant.consultant_name = res.fullname;
						consultant.days = [];
						consultant.description = res.description;
						consultant.is_online = res.is_online;
						consultant.is_voice_call = res.is_voice_call;
						consultant.is_chat = res.is_chat;
						consultant.media = res.media;
						consultant.meta_description = res.meta_description;
						consultant.meta_keywords = res.meta_keywords;
						consultant.meta_title = res.meta_title;
						consultant.minPriceCall = null;
						consultant.minPriceChat = null;
						consultant.personal_code = res.personal_code;
						consultant.rate = res.rate;
						consultant.title = res.title;
						consultant.plan = res.plan;
						consultant.timeline = [];
						this.setSeo(
							{
								metaTitle: res['seo'].title,
								metaDescription: res['seo'].description,
								metaKeywords: res['seo'].keywords,
								img: res['media'].path,
								isNoIndex: false,

							}
						)
						res.plan.price.map((prices) => {
							const price = new ConsultantPlanPrice();
							price.id = prices.id;
							price.is_active = prices.is_active;
							price.name = prices.name;
							price.price = prices.price;
							price.price_extra = prices.price_extra;
							price.time = prices.time;
							price.type = prices.type;
							consultant.consultantPlan_price.push(price);
						});
						res.plan.timeline.map((time) => {
							const planTimeline = new Timeline();
							planTimeline.from = time.hours[0].from;
							planTimeline.id = time.hours[0].id;
							planTimeline.to = time.hours[0].to;
							planTimeline.reserve_day = time.reserve_day;
							this.timeline.push(planTimeline);
						});
						consultant.chat_message = res.chat_message;
						consultant.call_message = res.call_message;
						this.details = consultant;
						console.log(this.details);
						console.log(this.details.media);
						this.consultant_name = consultant.consultant_name;
						this.comments_count = res.plan.comment_count;
						this.comments = res.plan.comments;
						this.plan_id = res.plan.id;
						if (res.plan?.call?.wait_time) {
							this.countdown(res.plan.call.wait_time);
						}
						this.global.dismisLoading();
						this.breadCrumb = [
							{ url: '/', name: 'صفحه نخست' },
							{ url: `/consultation/${res?.category?.seo.link}`, name: ` ${res?.category?.name} ` },
							{ url: `/consultation/adviser/${res?.category?.children[0].seo.link}`, name: ` ${res?.category?.children[0].name} ` },
							{ url: `/consultation/adviser/${res?.category?.children[0].seo.link}/${this.myId}`, name: `پروفایل ${this.details?.consultant_name} ` },
						];
					},
					(err) => {
						this.loading = false;
						if (err.status === 404 || err.status === 301) {
							this.navCtrl.navigateForward('/not-found');
						} else if (err.status === 400 && err.error.data['redirectUrl']) {
							this.seo.redirect(err.error.data['redirectUrl']);
							return;
						} else {
							this.global.dismisLoading();
						}
					}
				);
		});
	}

	onClickBack() {
		if (this.global.isBrowser) {
			window.history.back();

		}
	}

	addToFavourite(id) {
		this.favLoading = true;
		this.global
			.httpPost('addFavorite', {
				consultant_id: id,
			})
			.subscribe(
				(res) => {
					this.favLoading = false;
				},
				(err) => {
					this.favLoading = false;
					this.global.showError(err);
				}
			);
	}

	async reservePlan() {
		const modal = await this.modalController.create({
			component: TimelineComponent,
			componentProps: { timeLine: this.timeline, planId: this.plan_id },
		});

		await modal.present();
	}

	calculateTime(price, time) {
		const startPrice = parseInt(
			(this.balanceService.getUserBalance().value / price).toFixed(0),
			10
		);
		const calcTime = (startPrice / time).toFixed(2);
	}

	async connectPlan(item, disabled) {
		if (!disabled) {
			if (!this.waitTime && !this.consultantSelf) {
				if (this.details?.is_online === 1) {
					if (this.global.getLogin().value) {

						this.newChatModal(this.details?.call_message, item.type);

					} else {
						const alert = await this.alertController.create({
							header: 'دریافت مشاوره',
							message:
								'برای دریافت مشاوره ابتدا باید به حساب کاربری خود وارد شوید',
							buttons: [
								{
									text: 'ورود/عضویت',
									handler: () => {
										this.global.showLogin(`/consultation/adviser/${this.catId}/${this.myId}`);
									},
								},
								{
									text: 'لغو',
									role: 'cancel',
								},

							],
						});
						await alert.present();
					}
				} else {
					this.global
						.showAlert(
							'مشاور آفلاین ',

							`کاربر گرامی، در حال حاضر مشاور <strong> ${this.details.consultant_name} </strong> آفلاین است و قادر به پاسخگویی نمی باشد.
							لطفا از قسمت رزرو زمان خود را انتخاب کنید و یا به مشاوران آنلاین دیگر درخواست بدهید`,
							[
								{
									text: 'مشاهده زمان بندی',
									handler: () => {
										this.reservePlan();
									},
								},
								{
									text: 'لغو',
									role: 'cancel',
								},

							],
							undefined,
							'customAlert'
						)
						.then((al) => {
							al.present();
						});
				}
			}
		}



	}

	async newChatModal(msg, type) {
		const modal = await this.modalController.create(
			{
				component: NewChatComponent,
				componentProps: {
					consultantText: msg,
					consultantName: this.consultant_name,
					categoryName: this.details
						?.category?.name,
					planId: this.plan_id,
					itemType: type
				},
				cssClass: 'walletComponent',
			}
		);
		modal.present();
		modal.onDidDismiss().then((data) => {
			const res = data.data;

			if (res) {
				if (res.msg) {
					this.global.showToast(res.msg, 2000, 'top');
				}
				if (res.link) {
					this.iab.create(
						res.link,
						'_self'
					);
				} else if (res.chat) {
					this.navCtrl.navigateForward(['/conversation/detail', res.chat.id]);
				}

				if (res.balance) {
					this.balanceService.setUserBalance(res.balance);
				}

				if (res.wait_time) {
					this.countdown(res.wait_time);
				}

			}
		});
	}

	/**
	 * @function finalAlert(description)
	 * @param description = string
	 * @todo present ionic alert by alertController
	 *  shows an alert that shows description param as message
	*/

	async finalAlert(description: string) {
		const alert = await this.alertController.create({
			header: `درخواست شما ثبت شد`,
			message: description,
			buttons: [
				{
					text: 'شروع گفتگوی متنی',
					handler: () => {
						this.navCtrl.navigateForward('/conversation');
					}
				},
				{
					text: 'متوجه شدم',
					role: 'cancle',
				},
			],
			cssClass: 'customAlert',
		});
		await alert.present();
	}

	countdown(duration) {
		const countDownDate = new Date(duration).getTime();
		this.interval = this.global.SSRsetInterval(() => {
			const now = new Date().getTime();
			const distance = countDownDate - now;
			if (distance > 0) {
				const hours = Math.floor(
					(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
				);
				const minutes = Math.floor(
					(distance % (1000 * 60 * 60)) / (1000 * 60)
				);
				const seconds = Math.floor((distance % (1000 * 60)) / 1000);
				this.waitTime = {
					h: hours,
					m: minutes,
					s: seconds,
				};
			} else {
				clearInterval(this.interval);
				this.waitTime =
					' زمان انتظار برای درخواست شما به اتمام رسیده. همکاران ما درحال پیگیری می باشند. از صبر و شکیبایی شما متشکریم ';
				this.timeEx = true;
			}
		}, 1000);
	}


	setSeo(data) {

		this.seo.generateTags({
			title: data.metaTitle,
			description: data.metaDescription,
			keywords: data.metaKeywords,
			image: data.img,
			isNoIndex: data.isNoIndex,
		});

	}
}
