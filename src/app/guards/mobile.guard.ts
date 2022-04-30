import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ResponsiveService } from '../services/responsive.service';

@Injectable({
	providedIn: 'root'
})


export class MobileGuard implements CanActivate {
	mobile = false;
	constructor(private navCtrl: NavController, private responsiveService: ResponsiveService) {
		this.responsiveService.isMobile.subscribe(val => {
			this.mobile = val;
		})
	}

	path: ActivatedRouteSnapshot[];
	route: ActivatedRouteSnapshot;

	canActivate() {
		if (this.mobile) {
			return true;
		} else {
			this.navCtrl.navigateRoot('/conversation')
		}
	}
}