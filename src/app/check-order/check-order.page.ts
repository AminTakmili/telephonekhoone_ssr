import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActivatedRoute } from '@angular/router';
import { ScreensizeService } from '../services/screensize.service';

@Component({
	selector: 'app-check-order',
	templateUrl: './check-order.page.html',
	styleUrls: ['./check-order.page.scss'],
})
export class CheckOrderPage implements OnInit {
	orderId: number;
	orderType: string;
	paymentStatus = 0;
	loading = false;
	backBtnLink = '';
	breadCrumb = [
		{ url: '/', name: 'خانه' },
		{ url: '/payment/portal', name: 'انتقال به درگاه' },
	];

	constructor(
		public navCtrl: NavController,
		public global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private screenSize: ScreensizeService
	) { }

	async ngOnInit() {
		this.orderId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
		this.orderType = this.activatedRoute.snapshot.paramMap.get('type');
		const userTypeLink = this.global.getUserType().value === 'consultant' ? '/profile-consultant' : '/profile';
		if (this.orderType === 'chat') {
			if (this.screenSize.isDesktop) {
				this.backBtnLink = '/conversation/detail/'+this.orderId
			} else {
				this.backBtnLink = '/conversation/mobile/detail/'+this.orderId
			}
		} else if (this.orderType === 'wallet') {
			this.backBtnLink = userTypeLink + '/transactions';
		} else if (this.orderType === 'call') {
			this.backBtnLink = userTypeLink + '/mycalls';
		} else if (this.orderType === 'seminar') {
			this.backBtnLink = userTypeLink + '/media/archive';
		} else if (this.orderType === 'media') {
			this.backBtnLink = userTypeLink + '/media/archive';
		}
		this.checkPayment();
	}

	checkPayment() {
		this.loading = true;
		this.global
			.httpPost(
				'payment/check',
				{
					id: this.orderId,
					type: this.orderType
				}
			).subscribe(async (res) => {
				this.navCtrl.navigateBack(this.backBtnLink).then(() => {
					this.global.showToast(res.msg, 2000, 'top');
					if (res.description) {
						this.global.showAlert('ثبت موفق', res.description, [
							{
								text: 'متوجه شدم',
								role: 'cancel'
							}
						]).then(alert => {
							alert.present();
						});
					}
				});
				this.loading = false;
			}, err => {
				this.loading = false;
				this.global.showError(err).then(() => {
					this.navCtrl.navigateBack('/');
				});
			});
	}

}
