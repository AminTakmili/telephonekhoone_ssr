import {Component, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {FormBuilder, FormGroup} from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {NavController} from '@ionic/angular';
import {GlobalService} from 'src/app/services/global.service';
import {UserBalanceService} from 'src/app/services/user-balance.service';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
    breadCrumb = [
        {url: '/', name: 'صفحه نخست'},
        {url: '/profile', name: 'پروفایل'},
        {url: '/profile/wallet', name: 'افزایش موجودی حساب کاربری'},
    ];
    limit = 10;
    offset = 0;
    payLoading = false;
    balance = 0;
    backurl = this.global.getSiteUrl() + 'pages/cart/payment/wallet';
    packages: Packages[] = [];
    walletForm: FormGroup;
    loading = false;

    constructor(
        private global: GlobalService,
        private fb: FormBuilder,
        private navCtrl: NavController,
        private balanceService: UserBalanceService,
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

    walletPackages = this.global.httpGet('profile/walletPackages');

    ngOnInit() {
        this.getWalletInfo();
    }

    setPackage(item) {
        this.walletForm.get('amount').setValue(item.amount);
    }

    getWalletInfo() {
        let global = this.global;
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
                    if (data == 'req') {
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
						if (res.link) {
							this.iab.create(res.link, '_self');
						}
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
