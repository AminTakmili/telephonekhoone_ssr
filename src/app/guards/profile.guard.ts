import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { NavController } from "@ionic/angular";
import { Observable } from "rxjs";
import { GlobalService } from "../services/global.service";

@Injectable({
  providedIn: "root",
})
export class ProfileGuard implements CanActivate {
  constructor(private global: GlobalService, private navCtrl: NavController) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.global.getLogin().value) {
      if (this.global.getUserType().value == "user") {
        return true;
      } else {
        this.navCtrl.navigateRoot("/profile-consultant/editinfo");
      }
    } else {
      this.navCtrl.navigateRoot("/login");
    }
  }
}
