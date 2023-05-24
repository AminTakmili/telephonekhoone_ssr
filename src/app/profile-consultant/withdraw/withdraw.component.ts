import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { SeoService } from 'src/app/services/seo.service';
import { UserBalanceService } from 'src/app/services/user-balance.service';

@Component({
	selector: 'app-withdraw',
	templateUrl: './withdraw.component.html',
	styleUrls: ['./withdraw.component.scss'],
})
export class WithdrawComponent implements OnInit {
	payLoading = false;
	balance = 0;
	walletForm: FormGroup;
	lastPayRequest: any;
	breadCrumb = [
		{ url: '/', name: 'تلفن خونه' },
		{ url: '/profile-consultant', name: 'پروفایل مشاور' },
		{ url: '/profile-consultant/withdraw', name: 'برداشت از حساب' },
	];

	constructor(
		public global: GlobalService,
		private fb: FormBuilder,
		private balanceService: UserBalanceService,
		private alertController: AlertController,
		private _decimalPipe: DecimalPipe,
		private seo: SeoService,
	) {
		this.balanceService.getUserBalance().subscribe((value) => {
			this.balance = value;
		});
		this.walletForm = this.fb.group({
			amount: [
				'',
				Validators.compose([
					Validators.required,
					Validators.max(this.balance),
					Validators.min(1),
				]),
			],
		});
	}

	ngOnInit() {
		this.setSeo(
			{
				metaTitle: 'اطلاعات فردی',
				isNoIndex: true
			}
		)
	}

	ionViewWillEnter() {
		this.getHistoryData();
		this.setSeo(
			{
				metaTitle: 'اطلاعات فردی',
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

	async payWallet() {
		this.global.validateAllFormFields(this.walletForm);
		if (this.walletForm.valid) {
			if (
				this.global.getUserInfo()?.card?.number &&
				this.global.getUserInfo()?.card?.name
			) {
				const alert = await this.alertController.create({
					header: 'دریافت وجه',
					message: `مبلغ <strong>${this._decimalPipe.transform(this.walletForm.get('amount').value)
						}</strong> تومان به حساب بانک <strong>${this.global.getUserInfo()?.card?.name
						}</strong> با شماره <strong>${this.global.getUserInfo()?.card?.number
						}</strong> واریز خواهد شد`,
					buttons: [
						{
							text: 'تایید',
							handler: () => {
								this.payLoading = true;
								this.global
									.httpPost('profile/cashout', {
										amount: this.walletForm.get('amount')
											.value,
									})
									.subscribe(
										(res) => {
											this.payLoading = false;
											this.global.showToast(
												res.msg,
												2000,
												'top',
												'success'
											);
											this.balance = res.balance;
											this.balanceService.setUserBalance(
												res.balance
											);
											const amountInput = this.walletForm.get('amount');
											amountInput.setValue('')
											amountInput.setValidators(
												Validators.compose([
													Validators.required,
													Validators.max(
														this.balance
													),
													Validators.min(1),
												])
											)

										},
										(err) => {
											this.payLoading = false;
											this.global.showError(err);
										}
									);
							},
						},
						{
							text: 'لغو',
							role: 'cancle',
						},

					],
				});
				await alert.present();
			} else {
				const alert = await this.alertController.create({
					header: 'اطلاعات حساب',
					message: `اطلاعات حساب بانکی خود را از منو اطلاعات فردی تکمیل کنید `,
					buttons: [
						{
							text: 'تایید',
							role: 'cancle',
						},
					],
				});
				await alert.present();
			}
		}
	}

	getHistoryData() {
		this.global
			.httpPost("profile/cashouts", {
				limit: 10,
				offset: 0
			}).subscribe(
				(res) => {
					this.lastPayRequest = res[0];
				},
				(err) => {
					this.global.showError(err);
				}
			);
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
}
