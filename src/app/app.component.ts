// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: 'app.component.html',
//   styleUrls: ['app.component.scss'],
// })
// export class AppComponent {
//   constructor() {}
// }

import { ApplicationRef, Component } from "@angular/core";
import { MenuController } from "@ionic/angular";

import { Platform } from "@ionic/angular";
// import { SplashScreen } from "@ionic-native/splash-screen/ngx";
// import { StatusBar } from "@ionic-native/status-bar/ngx";
import { GlobalService } from "./services/global.service";
import { NavigationEnd, Router } from "@angular/router";
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs/internal/observable/interval';
import { UserBalanceService } from "./services/user-balance.service";
import { ResponsiveService } from './services/responsive.service';
@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.component.scss"],
})
export class AppComponent {
	cahtBadge: number;
	callsLink = '';
	callBadge: number;
	userType: string;
	constructor(
		private platform: Platform,
		// private splashScreen: SplashScreen,
		// private statusBar: StatusBar,
		private menu: MenuController,
		public global: GlobalService,
		private router: Router,
		private balanceService: UserBalanceService,
		private update: SwUpdate,
		private appRef: ApplicationRef,
		private responsiveService: ResponsiveService
	) {

		
		this.global.setItemFormStorage();
		
		if (this.global.isBrowser) {
			this.updateClient();
		}
		// console.log(this.update);
		// console.log(this.update.isEnabled);
		// this.update.available.subscribe((event) => {
		// 	console.log(event);
		// });

		
		this.initializeApp();
		this.checkUpdate();
		this.router.events.subscribe((ev) => {
			if (ev instanceof NavigationEnd) {
				if (this.global.getLogin().value) {
					
					this.global.httpGet("userInfo").subscribe(
						(res) => {
							this.global.setUserInfo(res);
							this.balanceService.setUserBalance(res.balance);
						},
						(err) => {
							this.global.showError(err);
						}
					);
					if (!this.global.getUserInfo().name) {
						this.global.changeLogin(false);
						return;
					}
				}
			}
		});
		// const isMobile = this.responsiveService.isMobile.value;
		// if (isMobile) {
		// 	this.global.getUserType().subscribe((val) => {
		// 		if (val != null) {
		// 			this.userType = val;
		// 			if (val == 'consultant') {
		// 				this.callsLink = '/profile-consultant/mycalls';
		// 			} else {
		// 				this.callsLink = '/profile/mycalls';
		// 			}
		// 		}
		// 	});
		// 	this.global.getBadges().subscribe((val) => {
		// 		this.cahtBadge = val.chat;
		// 		this.callBadge = val.call;
		// 	});
		// }
		this.fetchApi()
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// this.statusBar.styleDefault();
			// this.splashScreen.hide();
		});
	}

	updateClient() {
		if (!this.update.isEnabled) {
			return;
		}
		this.update.available.subscribe((event) => {
			this.ShowAlertUpdate()
		});

		this.update.activated.subscribe((event) => {
		});
	}

	ShowAlertUpdate() {
		this.global.showAlert('به روز رسانی',
			'ورژن کنونی قدیمی شده . برای مشاهده نسخه ی جدید سایت و pwa بر روی بروز رسانی کلیک کنید', [
			{
				text: 'بروزرسانی',
				handler: () => {
					this.update.activateUpdate().then(() => location.reload());
				}
			}
		]).then((alert) => {
			alert.present();
		});

	}

	checkUpdate() {
		this.appRef.isStable.subscribe((isStable) => {
			if (isStable) {
				const timeInterval = interval(8 * 60 * 60 * 1000);

				timeInterval.subscribe(() => {
					this.update.checkForUpdate().then(() => console.log('checked'));
				});
			}
		});
	}

	openFirst() {
		this.menu.enable(true, "first");
		this.menu.open("first");
	}

	openEnd() {
		this.menu.open("end");
	}

	openCustom() {
		this.menu.enable(true, "custom");
		this.menu.open("custom");
	}
	fetchApi() {
        this.global.httpGet('more/setting').subscribe(res => {
			console.log(res);
            this.global.enamad.next(res.enamad);
            this.global.logo.next(res.logo);
        })
    }
}
