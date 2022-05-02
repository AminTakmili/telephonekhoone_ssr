import { StorageService } from './../services/storage.service';
import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalService } from '../services/global.service';

@Injectable({
    providedIn: 'root',
})
export class ChatGuard implements CanActivate {
    constructor(private global: GlobalService,private storageService:StorageService) {}
    canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Promise<boolean>{
           
         // this.global.showLogin(state.url);

       return this.storageService.get('isLogin').then((val) => {
        if (val) {
                return true
            }
            this.global.showLogin(state.url);
            return false;
        });
    }
}
