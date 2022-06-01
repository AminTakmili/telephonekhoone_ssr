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
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ConsultantGuard implements CanActivate {
  // constructor(private global: GlobalService, private navCtrl: NavController) {}
  // // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ):
  //   | Observable<boolean | UrlTree>
  //   | Promise<boolean | UrlTree>
  //   | boolean
  //   | UrlTree {
  //   if (this.global.getLogin().value) {
  //     if (this.global.getUserType().value != "user") {
  //       return true;
  //     } else {
  //       this.navCtrl.navigateRoot("/profile/editinfo");
  //     }
  //   } else {
  //     this.navCtrl.navigateRoot("/login");
  //   }
  // }
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
          if (val2 === 'user') {
            this.navCtrl.navigateRoot('/profile/editinfo');
          }else if(val2==="consultant"){
            return true;
          }else{
            this.navCtrl.navigateRoot('/login');
          }
          // this.navCtrl.navigateRoot('/profile-consultant/editinfo');
        });
      }

      this.navCtrl.navigateRoot('/login');
    });
  }
}
