import { environment } from './../../environments/environment';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { Observable, BehaviorSubject, Subject, forkJoin } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import {
	HttpClient,
	HttpHeaders,
	HttpErrorResponse,
	HttpParams,
} from '@angular/common/http';
import {
	AlertController,
	LoadingController,
	ModalController,
	NavController,
	ToastController,
} from '@ionic/angular';
import { AlertButton, AlertInput } from '@ionic/core';
import { UserInfo } from '../classes/UserInfo';
import { FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
// import { promise } from "protractor";
// import { resolve } from "dns";
// import { rejects } from "assert";
// import { DesktopLoginComponent } from "../desktop-login/desktop-login.component";
import { Router, NavigationEnd } from '@angular/router';
import { StorageService } from './storage.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
	providedIn: 'root',
})
export class GlobalService {
	enamad = new BehaviorSubject<string>('');
	pltfrm: string;
	isBrowser: boolean;
	backUrl = 'https://telephonkhoneh.com/payment';
	// https://telephonkhoneh.com/payment
	siteUrl = environment.siteUrl;
	badges = new BehaviorSubject<any>({});
	private menu = new BehaviorSubject<boolean>(null);
	userInfo = new BehaviorSubject<UserInfo>(null /*JSON.parse(localStorage.getItem('userInfo'))*/);
	userType = new BehaviorSubject<string>( null /*localStorage.getItem('userType')*/ );
	login = false ; /* JSON.parse(localStorage.getItem('isLogin')) */ 
	private _login = new BehaviorSubject<boolean>(this.login);
	private loading: Promise<HTMLIonLoadingElement>;
	private baseUrl = 'https://app.telephonkhoneh.com/api/';
	private imgUrl = 'https://app.telephonkhoneh.com/';
	pageLocation = '';
	urlSection = [];
	private token =environment.defaultToken
		// localStorage.getItem('token') === 
		
		// 	: localStorage.getItem('token');
	globalToast: HTMLIonToastElement;
	constructor(
		private http: HttpClient,
		private alertController: AlertController,
		private loadingController: LoadingController,
		private toastController: ToastController,
		// private storage: Storage,
		private platform: Platform,
		private router: Router,
		private navCtrl: NavController,
		private deviceService: DeviceDetectorService,
		private storageService: StorageService,
		@Inject(PLATFORM_ID) private platformId,

		
	) {
		this.isBrowser = isPlatformBrowser(this.platformId);
		this.storageService.set('myname','amin')
		// console.log("emad is browser",this.isBrowser);
		this.pltfrm = this.platform.platforms()[0];
		this.router.events.subscribe((ev) => {
			if (ev instanceof NavigationEnd) {
				this.pageLocation = ev.url;
				this.urlSection = this.pageLocation.split('/');
			}
		});

		this.storageService.get('enamad').then(val => {
			this.enamad.next(val);
		});

		// this.setItemFormStorage();
	}

	setItemFormStorage(){
		//userInfo
		this.storageService.get('userInfo').then((val) => {
			this.userInfo.next(val)
		});
		//userInfo
		this.storageService.get('userType').then((val) => {
			this.userType.next(val)
		});
		//login
		this.storageService.get('isLogin').then((val) => {
			this.login = val ;
		});
		//token
		this.storageService.get('token').then((val) => {
			this.token = val ;
		});
	}
	getPrices() {
		this.storageService.get('prices').then((val) => {
			// const price = JSON.parse(val);
			const price = val;
			return price;
		});
	}


	setEnamad(data) {
		this.storageService.set('enamad', data);
		this.enamad.next(data);
	}
	getSiteUrl() {
		return this.siteUrl;
	}

	getToken() {
		return this.token;
	}

	getImgUrl() {
		return this.imgUrl;
	}

	setUserType(value) {
		this.userType.next(value);
		this.storageService.set('userType', value);
	}

	getUserType() {
		return this.userType;
	}

	setToken(value) {
		this.token = value;
		this.storageService.set('token', value);
	}

	getUrl() {
		return {
			name: this.pageLocation,
			sections: this.urlSection,
		};
	}

	getBadges() {
		return this.badges;
	}

	setBadges(chatCount, callCount) {
		const counts = {
			chat: chatCount,
			call: callCount,
		};
		this.badges.next(counts);
	}

	async logOut(dontShowAlert?) {
		if (dontShowAlert) {
			localStorage.clear();
			this.storageService.clearAll();
			this.setUserType('');
			this.setToken('9x8869x31134x7906x6x54474x21x18xxx90857x');
			this.setUserInfo(new UserInfo());
			this.changeLogin(false);
			return;
		} else {
			const alert = await this.alertController.create({
				header: 'خروج از حساب کاربری',
				message: 'میخواهید از حساب کاربری خود خارج شوید ؟ ',
				buttons: [
					{
						text: 'تایید',
						handler: () => {
							this.changeLogin(false);
							localStorage.clear();
							this.storageService.clearAll();
							this.setUserType('');
							this.setUserInfo(new UserInfo());
							this.setToken('9x8869x31134x7906x6x54474x21x18xxx90857x');
							// window.location.reload();
						},
					},
					{
						text: 'لغو',
						role: 'cancle',
					},

				],
			});
			await alert.present();
		}
	}

	menuBehavior(): BehaviorSubject<boolean> {
		return this.menu;
	}

	removeToken() {
		this.storageService.remove('token');
		this.token = '9x8869x31134x7906x6x54474x21x18xxx90857x';
	}
	public getLogin() {
		return this._login;
	}

	public changeLogin(mychange: boolean) {
		this._login.next(mychange);
		this.storageService.set('isLogin', `${mychange}`);
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach((field) => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	getAppUrl(method?: string) {
		if (method === undefined) {
			return this.baseUrl;
		} else {
			return this.baseUrl + method;
		}
	}

	showLoading(text: string = 'درحال بارگذاری ...') {
		this.loading = this.loadingController.create({
			message: text,
		});
		return this.loading;
	}

	justNumber(event: any) {
		const pattern = /[0-9]/;
		let inputChar = String.fromCharCode(event.charCode);

		if (!pattern.test(inputChar)) {
			// invalid character, prevent input
			event.preventDefault();
		}
	}

	dismisLoading() {
		this.loading.then((loading) => {
			loading.dismiss();
		});
	}

	showAlert(
		header: string,
		message: string,
		buttons: AlertButton[],
		inputs?: AlertInput[],
		cssClass?: string
	): Promise<any> {
		return this.alertController.create({
			header,
			message,
			buttons,
			inputs,
			cssClass,
		});
	}

	async showToast(
		message: string,
		duration: number,
		position: 'top' | 'bottom' | 'middle',
		color?: string
	) {
		try {
			this.globalToast.dismiss();
		} catch (e) { }
		this.globalToast = await this.toastController.create({
			message,
			duration,
			position,
			color,
		});
		this.globalToast.present();
	}

	getUserDevice() {
		const isMobile = this.deviceService.isMobile();
		const isTablet = this.deviceService.isTablet();
		const isDesktopDevice = this.deviceService.isDesktop();

		if (isMobile) {
			return 'mobile';
		} else if (isTablet) {
			return 'tablet';
		} else if (isDesktopDevice) {
			return 'desktop';
		} else {
			return undefined;
		}
	}

	getUserInfo() {
		return this.userInfo.value;
	}

	setUserInfo(user) {
		const userInfo = {} as UserInfo;
		userInfo.name = user.fullname;
		userInfo.gender = user.gender;
		userInfo.is_chat = user.is_chat;
		userInfo.is_online = user.is_online;
		userInfo.is_video_call = user.is_video_call;
		userInfo.is_voice_call = user.is_voice_call;
		userInfo.mobile = user.mobile;
		userInfo.plans_count = user.plans_count;
		userInfo.type = user.type;
		userInfo.description = user.description;
		userInfo.balance = user.balance;
		userInfo.card = user.card;
		userInfo.category = user.category;
		userInfo.country = user.country;
		userInfo.media = user.media;
		userInfo.personal_code = user.personal_code;
		userInfo.id = user.id;
		userInfo.last_certificate = user.last_certificate;
		userInfo.experience_year = user.experience_year;
		this.storageService.set('userInfo', userInfo);

		this.userInfo.next(userInfo);
		this.badges.next({
			chat: user.chats_count,
			call: user.calls_count
		});
	}

	parallelRequest(requests: any[]) {
		return forkJoin(requests);
	}

	httpPost(url: string, params: any, token?: string): Observable<any> {
		if (token === undefined) {
			token = this.token;
		}
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${token}`,
				device: '1',
			}),
		};

		const str = [];
		if (typeof params.entries === 'function') {
			for (var pair of params.entries()) {
				str.push(pair[0] + '=' + pair[1]);
			}
		} else {
			for (const p in params) {
				if (params.hasOwnProperty(p)) {
					str.push(
						encodeURIComponent(p) +
						'=' +
						encodeURIComponent(params[p])
					);
				}
			}
		}
		return this.http.post<any>(
			this.getAppUrl(url),
			str.join('&'),
			httpOptions
		);
	}

	httpPatch(url: string, params: object, token?: string): Observable<any> {
		if (token === undefined) {
			token = this.token;
		}
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${token}`,
			}),
		};

		const str = [];
		for (const p in params) {
			if (params.hasOwnProperty(p)) {
				str.push(
					encodeURIComponent(p) + '=' + encodeURIComponent(params[p])
				);
			}
		}
		return this.http.patch<any>(
			this.getAppUrl(url),
			str.join('&'),
			httpOptions
		);
	}

	httpDel(url: string, params: object, token?: string): Observable<any> {
		if (token === undefined) {
			token = this.token;
		}

		const options = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			}),
			body: params,
		};

		return this.http.delete<any>(this.getAppUrl(url), options);
	}

	httpUpload(url: string, params: object, token?: string): Observable<any> {
		if (token === undefined) {
			token = this.token;
		}

		return this.http.post<any>(this.getAppUrl(url), params, {
			reportProgress: true,
			observe: 'events',
			headers: new HttpHeaders({
				// 'Content-Type': 'multipart/form-data',

				Authorization: `Bearer ${token}`,
			}),
		});
	}

	httpUploadPatch(
		url: string,
		params: object,
		token?: string
	): Observable<any> {
		if (token === undefined) {
			token = this.token;
		}

		return this.http.patch<any>(this.getAppUrl(url), params, {
			reportProgress: true,
			observe: 'events',
			headers: new HttpHeaders({
				Authorization: `Bearer ${token}`,
			}),
		});
	}

	httpGet(url: string, token?: string): Observable<any> {
		if (token === undefined) {
			token = this.token;
		}
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${token}`,
			}),
		};
		return this.http.get<any>(this.getAppUrl(url), httpOptions);
	}

	httpGetWithData(
		url: string,
		params: object,
		token?: string
	): Observable<any> {
		if (token === undefined) {
			token = this.token;
		}
		let httpOptions = {};
		httpOptions = {
			headers: new HttpHeaders({
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			}),
		};

		const str = [];
		for (const p in params) {
			if (params.hasOwnProperty(p)) {
				str.push(
					encodeURIComponent(p) + '=' + encodeURIComponent(params[p])
				);
			}
		}
		return this.http.get<any>(
			this.getAppUrl(url) + '?' + str.join('&'),
			httpOptions
		);
	}

	showLogin(nextUrl?): Promise<any> {
		return new Promise(async (resolve) => {
			this.storageService.set('url', nextUrl ?? this.getUrl().name);
			this.navCtrl.navigateForward('login');
			resolve('');
		});
	}

	forceLogOut() {
		this.changeLogin(false);
		localStorage.clear();
		this.storageService.clearAll();
		// window.location.reload();
	}

	async showError(err: HttpErrorResponse): Promise<any> {
		return new Promise(async (resolve) => {
			if (err.status === 403 || err.status === 401) {
				localStorage.clear();
				const alert = await this.alertController.create({
					header: 'عدم دسترسی',
					message:
						'جهت دسترسی به این بخش ابتدا وارد حساب کاربری خود شوید',
					buttons: [
						{
							text: 'وررود/عضویت',
							handler: () => {
								this.forceLogOut();
								this.showLogin();
							},
						},
						{
							text: 'لغو',
							role: 'cancel',
						},

					],
				});
				alert.present();
			} else if (err.status === 400) {
				if (err.error.msg) {
					const alert = await this.alertController.create({
						header: 'خطا',
						message: err.error.msg,
						buttons: [
							{
								text: 'تایید',
								role: 'cancel',
							},
						],
					});
					await alert.present();
				}

				resolve('');
			} else if (err.status === 500) {
				const alert = await this.alertController.create({
					header: 'خطا',
					message: 'متاسفانه خطایی رخ داده است !',
					buttons: [
						{
							text: 'تلاش مجدد',
							// role: "cancel",
							handler: () => {
								resolve('req');
							},
						},
					],
				});
				await alert.present();
			}
		});
	}
}
