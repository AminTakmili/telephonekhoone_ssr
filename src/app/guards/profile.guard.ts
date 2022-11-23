import { StorageService } from './../services/storage.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GlobalService } from '../services/global.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate {
  constructor(
    private global: GlobalService,
    private StorageService: StorageService,
    private navCtrl: NavController
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    return this.StorageService.get('isLogin').then((val) => {
      if (val) {
        return this.StorageService.get('userType').then((val2) => {
          if (val2 == 'user') {
            return true;
          }
          this.navCtrl.navigateRoot('/profile-consultant/editinfo');
        });
      }
      this.navCtrl.navigateRoot('/registerlogin');
    });

  }

  // if (this.global.getLogin().value) {
  //   if (this.global.getUserType().value == "user") {
  //     return true;
  //   } else {
  //     this.navCtrl.navigateRoot("/profile-consultant/editinfo");
  //   }
  // } else {
  //   this.navCtrl.navigateRoot("/login");
  // }
}
