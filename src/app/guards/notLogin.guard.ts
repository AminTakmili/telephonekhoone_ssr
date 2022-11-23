import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GlobalService } from '../services/global.service';
import { CanActivate } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class NotLoginGuard implements CanActivate {
	isLogin = false;
	constructor(private global: GlobalService, private navCtrl: NavController) {
		this.global.getLogin().subscribe((res) => {
			this.isLogin = res;
		});
	}

	path: ActivatedRouteSnapshot[];
	route: ActivatedRouteSnapshot;

	canActivate() {
		if (this.isLogin && this.global.getUserInfo().type === 'consultant') {
			return true;
		} else {
			this.global.logOut(true);
			this.navCtrl.navigateRoot('/registerlogin');
		}
	}
}
