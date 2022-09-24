import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { UserBalanceService } from 'src/app/services/user-balance.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    host: {
        '(document:click)': 'anyWhereClick($event)',
    },
})
export class HeaderComponent implements OnInit {
    showProfileBox = true;
    cahtBadge: number;
    callsLink = '';
    callBadge: number;
    @Input() type: string;
    userType: string;
    public logo = '';

    constructor(
        public global: GlobalService,
        private _eref: ElementRef,
        public balanceService: UserBalanceService,
        private navCtrl: NavController
    ) {
        this.global.getUserType().subscribe((val) => {
            if (val != null) {
                this.userType = val;
                if (val == 'consultant') {
                    this.callsLink = '/profile-consultant/mycalls';
                } else {
                    this.callsLink = '/profile/mycalls';
                }
            }
        });
    }

    ngOnInit() {
        this.global.getBadges().subscribe((val) => {
            this.cahtBadge = val.chat;
            this.callBadge = val.call;
        });
        this.global.logo.subscribe(res => {
			if (res) {
				
				this.logo = res;
			}
		});
    }
    onProfileClick() {
        this.showProfileBox = !this.showProfileBox;
    }
    anyWhereClick(event: MouseEvent) {
        const targetClass = event.target['className'];
        if (
            !this._eref.nativeElement.contains(event.target) ||
            targetClass == 'home-navigation'
        )
            this.showProfileBox = true;
    }

}
