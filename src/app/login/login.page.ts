import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
	AlertController,
	IonInput,
	ModalController,
	NavController,
	PopoverController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UserInfo } from '../classes/UserInfo';
import { CountriesPopoverComponent } from '../components/countries-popover/countries-popover.component';
import { RulesPage } from '../rules-component/rules.page';
import { GlobalService } from '../services/global.service';
import { StorageService } from '../services/storage.service';
import { UserBalanceService } from '../services/user-balance.service';
import { ValidateMobile } from '../validators/mobile.validator';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	loginForm: FormGroup;
	areaCode = {
		code: 'IR',
		id: 103,
		name: 'Iran',
		phone_code: '98',
	};
	breadCrumb = [];
	countries: Country[] = [];
	breadCrumbTitle = 'ورود به حساب کاربری';
	componentType = 'login';
	timer = '02:00';
	interval: any;
	verifyForm: FormGroup;
	registerForm: FormGroup;
	Inputfill = 0;
	nextLink = '';
	mobile: number;
	isDesktop = false;
	loading = false;
	isChecked = false;
	countryLoading = false;
	activeRegister: number;
	@ViewChild('codeInput', { static: false }) codeInput: IonInput;
	@ViewChild('mobileInput', { static: false }) mobileInput: IonInput;

	constructor(
		public global: GlobalService,
		private fb: FormBuilder,
		private modalController: ModalController,
		private alertController: AlertController,
		private navCtrl: NavController,
		private popoverController: PopoverController,
		private userBalance: UserBalanceService,
		private storage: Storage,
		private StorageService: StorageService,
		
	) {
		this.StorageService.get('url').then((val) => {
			this.nextLink = val;
		});
		this.loginForm = this.fb.group({
			mobile: [
				'',
				Validators.compose([
					Validators.required,
					ValidateMobile,
					//   Validators.minLength(10),
				]),
			],
		});
		this.verifyForm = this.fb.group({
			code: [
				'',
				Validators.compose([
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(5),
				]),
			],
		});
		this.registerForm = this.fb.group({
			fullName: ['', Validators.compose([Validators.required])],
			gender: ['', Validators.compose([Validators.required])],
		});
	}

	codeChange() {
		if (this.verifyForm.get('code')?.value?.length === 5) {
			this.onVerify();
		}
	}

	changeCheck() {
		this.isChecked = !this.isChecked;
	}

	setActiveRegister(value) {
		this.activeRegister = value;
	}

	ngOnInit() {
		const userInfo = this.global.getUserInfo();
		this.getCountries();
		if (userInfo && userInfo.mobile && !userInfo.name) {
			if (userInfo.type === 'user') {
				this.changeComponent('register');
			} else {
				this.navCtrl.navigateRoot('/sign-up');
			}
		} else {
			this.global.logOut(true);
		}
		this.breadCrumb = [
			{ url: '/', name: 'صفحه نخست' },
			{ url: '/login', name: this.breadCrumbTitle },
		];
	}

	async changeNum() {
		const alert = await this.alertController.create({
			header: 'تغییر شماره همراه',
			message: `برای تغییر شماره ${`${this.areaCode.phone_code}` + `${this.mobile}` + '+'
				} اطمینان دارید ؟`,
			buttons: [
				{
					text: 'بله',
					handler: () => {
						this.changeComponent('login');
					},
				},
				{
					text: 'خیر',
					role: 'cancle',
				},
			],
		});

		await alert.present();
	}

	checkMobile() {
		let numberSplit: any;

		const mobileNumber = `${this.loginForm.get('mobile')?.value}`;
		numberSplit = mobileNumber.split('');
		if (numberSplit[0] === '0') {
			numberSplit.shift();
			numberSplit = numberSplit.join('');
			this.mobile = parseInt(numberSplit, 10);
			return numberSplit;
		} else {
			this.mobile = parseInt(this.loginForm.get('mobile')?.value, 10);
			return this.loginForm.get('mobile')?.value;
		}
	}

	login() {
		this.loading = true;
		this.global
			.httpPost('checkMobileNumber', {
				mobile: this.checkMobile(),
				country_id: this.areaCode.id,
			})
			.subscribe(
				(res) => {
					this.loading = false;
					this.global.showToast(res.msg, 2000, 'top');
					this.changeComponent('verify');
					this.sendVerifyCode();
				},
				async (err) => {
					this.loading = false;
					const error = err.error;
					if (
						error.is_registered !== undefined &&
						error.is_registered !== null &&
						error.is_registered === false
					) {
						this.changeComponent('type');
					} else {
						if (error.alert) {
							const alert = await this.alertController.create({
								message: error.msg,
								buttons: ['تایید'],
							});

							await alert.present();
						} else {
							this.global.showToast(
								error.msg ? error.msg : error.error,
								2000,
								'top'
							);
						}
					}
				}
			);
	}

	getCountries() {
		this.countryLoading = true;
		this.global.httpGet('getCountries').subscribe(
			(res) => {
				this.countryLoading = false;
				res.map((item) => {
					const countryItem = {} as Country;
					countryItem.code = item.code;
					countryItem.id = item.id;
					countryItem.name = item.name;
					countryItem.phone_code = parseInt(item.phone_code, 10);
					this.countries.push(countryItem);
				});
			},
			(err) => {
				this.countryLoading = false;
				this.global.showError(err);
			}
		);
	}

	async countriesPopover(ev: any) {
		const popover = await this.popoverController.create({
			component: CountriesPopoverComponent,
			event: ev,
			translucent: false,
			componentProps: {
				list: this.countries,
			},
		});

		await popover.present();
		popover.onWillDismiss().then((data) => {
			if (data.data) {
				this.areaCode = data.data;
			}
		});
	}

	async rulesCheck() {
		const modal = await this.modalController.create({
			component: RulesPage,
			componentProps: { value: 123 },
		});

		await modal.present();
	}

	countdown() {
		let countDownDate: any = new Date();
		countDownDate.setMinutes(countDownDate.getMinutes() + 2);
		countDownDate = countDownDate.getTime();
		this.interval = setInterval(() => {
			const now = new Date().getTime();
			const distance = countDownDate - now;
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor(
				(distance % (1000 * 60 * 60)) / (1000 * 60)
			);
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			if (distance < 0) {
				clearInterval(this.interval);
				this.timer = '00:00';
			} else {
				this.timer = `0${minutes}:${seconds < 10 ? '0' + seconds : seconds
					}`;
			}
		}, 1000);
	}

	reSend() {
		this.global.showLoading().then(() => {
			this.global
				.httpPost('sendVerifyCode', {
					mobile: this.loginForm.get('mobile')?.value,
				})
				.subscribe(
					(res) => {
						this.global.showToast(res.msg, 2000, 'top');

						this.global.dismisLoading()
						this.timer = '02:00';
						this.countdown();
						setTimeout(() => {
							this.codeInput.getInputElement().then((input) => {
								input.focus();
							});
							this.Inputfill = 1;
						}, 100);
					},
					(error) => {

						this.global.dismisLoading()
						this.global.showError(error);
					}
				);
		});
	}

	registerNumber() {
		this.global.showLoading().then((loader) => {
			this.global
				.httpPost('registerMobile', {
					mobile: this.mobile,
					country_id: this.areaCode.id,
					type: this.activeRegister === 1 ? 'user' : 'consultant',
				})
				.subscribe(
					(res) => {
						this.changeComponent('verify');

						this.global.dismisLoading()
						this.sendVerifyCode();
						this.global.showToast(res.msg, 2000, 'top');
					},
					(err) => {

						this.global.dismisLoading()
						this.global.showError(err);
					}
				);
		});
	}

	sendVerifyCode() {
		this.global
			.httpPost('sendVerifyCode', {
				mobile: this.mobile,
			})
			.subscribe(
				(res) => { },
				(err) => {
					this.global.showError(err);
				}
			);
	}

	changeComponent(page) {
		if (page === 'login') {
			this.global.logOut(true).then(() => {
				this.componentType = page;
			});
			return;
		}
		this.componentType = page;
		if (page === 'verify') {
			clearInterval(this.interval);
			this.countdown();
			return;
		}

	}

	onVerify() {
		if (this.verifyForm.valid) {
			this.global.showLoading().then((loader) => {
					this.global
					.httpPost('checkVerifyCode', {
						mobile: this.mobile,
						verify_code: this.verifyForm.get('code')?.value,
					})
					.subscribe(
						(res) => {
	
							this.global.dismisLoading()
							this.userBalance.setUserBalance(res.balance);
							this.global.setUserInfo(res);
							this.global.setUserType(res.type);
							this.global.setToken(res.token);
							this.global.changeLogin(true);
							this.StorageService.set('isLogin', 'true');
							if (res.fullname) {
								this.navCtrl.navigateForward(
									this.nextLink ?? '/'
								);
							} else if (!res.fullname && res.type === 'user') {
								this.changeComponent('register');
							} else if (
								!res.fullname &&
								res.type === 'consultant'
							) {
								this.navCtrl.navigateForward('/sign-up');
							}
						},
						async (error) => {
							await this.global.dismisLoading();
							if (error.status === 500 || error.status === 400) {
								const alert = await this.alertController.create(
									{
										header: 'خطا',
										message: error.error.msg,
										buttons: [
											{
												text: 'بستن',
												role: 'cancel',
											},
										],
									}
								);
								alert.onDidDismiss().then(() => {
									{
										this.verifyForm.reset();
										setTimeout(() => {
											this.codeInput
												.getInputElement()
												.then((input) => {
													input.focus();
												});
											this.Inputfill = 1;
										}, 100);
									}
								});
								await alert.present();
							}
						}
					);
			});
		}
	}

	registerUser() {
		const fullName = this.registerForm.get('fullName').value;
		const gender = this.registerForm.get('gender').value;
		// console.log(this.name);
		if (this.isChecked) {
			this.global.showLoading().then(() => {
				this.global
					.httpPost('registerUser', {
						fullname: fullName,
						gender,
					})
					.subscribe(
						async (res) => {
							this.global.showToast(res.msg, 2000, 'top');
							this.global.dismisLoading()
							const userInfo = new UserInfo();
							userInfo.mobile = this.global.getUserInfo().mobile;
							userInfo.name = fullName;
							userInfo.gender = gender;
							userInfo.id = this.global.getUserInfo().id;
							this.global.setUserInfo(userInfo);
							this.global.changeLogin(true);
							this.StorageService.set('isLogin', 'true');
							this.global.menuBehavior().next(true);
							await this.navCtrl.navigateForward(this.nextLink ?? '/');
						},
						(error) => {
							this.global.dismisLoading()
							this.global.showError(error);
						}
					);
			});
		} else {
			this.global.showToast('مطالعه قوانین الزامی است !', 2000, 'top');
		}
	}
}

export interface Country {
	code: string;
	id: number;
	name: string;
	phone_code: number;
}
