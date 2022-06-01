import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';
import { UserMediaDetail } from 'src/app/models/userMedia.model';
import { GlobalService } from 'src/app/services/global.service';

@Component({
	selector: 'app-detail',
	templateUrl: './detail.component.html',
	styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
	payLoading = false;
	loading = true;
	mediaId: string;
	mediaDetail: UserMediaDetail;
	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/media', name: 'رسانه' },
	];

	constructor(
		private global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private title: Title,
		private _decimalPipe: DecimalPipe,
		private alertCtrl: AlertController,
		private iab: InAppBrowser
	) {
	}

	ngOnInit() {
		const id = this.activatedRoute.snapshot.paramMap.get('id');
		this.mediaId = id;
		this.getData(id);
	}

	getData(id) {
		this.global.showLoading().then(() => {
			
			this.loading = true;
			this.global
				.httpPost('media/show', {
					link: id,
				})
				.subscribe(
					(res) => {
						this.global.dismisLoading()
						this.mediaDetail = new UserMediaDetail().deserialize(res);
						this.title.setTitle(this.mediaDetail.title + ' | ' + 'تلفن خونه');
						this.loading = false;
					},
					(err) => {
						this.loading = false;
						this.global.dismisLoading()
						this.global.showError(err).then((data) => {
							if (data == 'req') {
								this.getData(this.mediaId);
							}
						});
					}
				);
		});
	}

	async getMediaFile() {
		if (this.global.getLogin().value) {
			let buttons = [];
			const paid = this.global.getUserInfo().balance >= this.mediaDetail.price;
			const walletPayable = `هزینه این رسانه <strong>${this._decimalPipe.transform(this.mediaDetail.price)}</strong> تومان و  موجودی کیف پول شما <strong>${this._decimalPipe.transform(this.global.getUserInfo().balance)}</strong> تومان میباشد .<br> میتوانید از طریق یکی از روش های زیر پرداخت را انجام دهید`;
			const walletNotPayable = `هزینه این رسانه <strong>${this._decimalPipe.transform(this.mediaDetail.price)}</strong> تومان است و موجودی کیف پول شما برای پرداخت کافی نمیباشد . لطفا از طریق درگاه بانکی اقدام به پرداخت نمایید.`;
			paid ? buttons = [
				{
					text: 'کیف پول',
					handler: () => {
						this.paymentMethod('wallet');
					}
				},
				{
					text: 'درگاه بانکی',
					handler: () => {
						this.paymentMethod('online');
					},
				}
			] : buttons = [
				{
					text: 'پرداخت از طریق درگاه بانکی',
					handler: () => {
						this.paymentMethod('online');
					},
				}
			]
			this.alertCtrl.create({
				header: 'پرداخت هزینه',
				message: paid ? walletPayable : walletNotPayable,
				buttons: buttons,
				cssClass: 'bigWidthAlert'
			}).then(alrt => {
				alrt.present();
			});
		} else {
			if (this.global.isBrowser) {
				const alert = await this.alertCtrl.create({
					header: 'دریافت رسانه',
					message:
						'برای دریافت این رسانه ابتدا باید به حساب کاربری خود وارد شوید',
					buttons: [
						{
							text: 'ورود/عضویت',
							handler: () => {
								this.global.showLogin();
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
		}
	}

	paymentMethod(method) {
		this.payLoading = true;
		this.global.httpPost('media/pay', {
			id: this.mediaId,
			type: method,
			back_url: this.global.siteUrl
		}).subscribe(res => {
			this.global.showToast(res.msg, 2000, 'top');
			if (method === 'online' && res.link) {
				this.iab.create(res.link, '_self');
			}

			this.payLoading = false;
		}, err => {
			this.global.showError(err);
			this.payLoading = false;
		});
	}

	getMainFile() {
		const mainFile = this.mediaDetail.media.find(x => x.name !== 'preview');
		const linkArray = mainFile.path.split('/');
		const fileName = linkArray[linkArray.length - 1];
		const fileInfo = {
			link: mainFile.path,
			name: fileName
		}
		return fileInfo;
	}


}
