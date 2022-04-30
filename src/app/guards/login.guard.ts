import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {NavController} from '@ionic/angular';
import {GlobalService} from '../services/global.service';
import {CanActivate} from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class LoginGuard implements CanActivate {
    constructor(private global: GlobalService, private navCtrl: NavController) {
    }

    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;

    canActivate() {
        if (this.global.getLogin().value === true) {
            this.navCtrl.navigateRoot('/');
        } else {
            return true;
        }
    }
}
