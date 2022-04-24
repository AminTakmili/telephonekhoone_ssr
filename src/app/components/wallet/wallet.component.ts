import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { UserBalanceService } from 'src/app/services/user-balance.service';

@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.component.html',
	styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
	@Input() remainPay;
	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/profile', name: 'پروفایل' },
		{ url: '/profile/wallet', name: 'افزایش موجودی حساب کاربری' },
	];
	limit = 10;
	offset = 0;
	payLoading = false;
	balance = 0;
	packages: Packages[] = [];
	walletForm: FormGroup;
	loading = false;
	backUrl = '';
	walletPackages = this.global.httpGet('profile/walletPackages');

	constructor(
		private global: GlobalService,
		private fb: FormBuilder,
		private navCtrl: NavController,
		private balanceService: UserBalanceService,
		private modalController: ModalController,
		private iab: InAppBrowser
	) {
		this.balanceService.getUserBalance().subscribe((value) => {
			this.balance = value;
		});
		this.walletForm = this.fb.group({
			amount: ['', Validators.compose([Validators.required])],
		});
	}


	walletArchive = this.global.httpPost('profile/wallet', {
		limit: this.limit,
		offset: this.offset,
	});

	dismiss() {
		this.modalController.dismiss();
	}


	ngOnInit() {
		this.getWalletInfo();
		this.backUrl = this.global.getUrl().name;
	}

	setPackage(item) {
		this.walletForm.get('amount').setValue(item.amount);
	}

	getWalletInfo() {
		const global = this.global;
		this.loading = true;
		global.parallelRequest([this.walletArchive, this.walletPackages]).subscribe(
			(res: any) => {
				this.loading = false;
				res[1].map((item) => {
					const packageItem = {} as Packages;
					packageItem.amount = item.amount;
					this.packages.push(packageItem);
				});
				this.balanceService.setUserBalance(res[0].balance);
			},
			(err) => {
				this.loading = false;
				global.showError(err).then((data) => {
					if (data === 'req') {
						this.getWalletInfo();
					}
				});
			}
		);
	}

	goTransactions() {
		this.navCtrl.navigateRoot('profile/transactions');
	}

	payWallet() {

		if (this.walletForm.valid) {
			this.payLoading = true;
			this.global
				.httpPost('profile/walletIncrease', {
					amount: this.walletForm.get('amount').value,
					back_url: this.global.backUrl
				})
				.subscribe(
					(res) => {
						this.payLoading = false;
						if (res.pay_link) {
							this.iab.create(res.pay_link, '_self');
						}
						this.dismiss();
					},
					(err) => {
						this.payLoading = false;
						this.global.showError(err);
					}
				);
		}
	}
}

interface Packages {
	amount: number;
}
