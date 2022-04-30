import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GlobalService } from '../services/global.service';

@Injectable({
  providedIn: 'root'
})

export class DesktopGuard implements CanActivate {
    constructor(private global: GlobalService, private navCtrl: NavController) {
    }

    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;

    canActivate() {
      return true;
    }
}