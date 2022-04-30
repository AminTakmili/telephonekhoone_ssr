import {Component, OnInit} from '@angular/core';
import {GlobalService} from 'src/app/services/global.service';

@Component({
    selector: 'app-reservation',
    templateUrl: './reservation.component.html',
    styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
    loading = false;
    limit = 10;
    offset = 0;
    breadCrumb = [
        {url: '/', name: 'صفحه نخست'},
        {url: '/profile', name: 'پروفایل'},
        {url: '/profile/editinfo', name: 'پکیج های مشاوره'},
    ];

    constructor(private global: GlobalService) {
    }

    ngOnInit() {
    }

	getReserveData() {
		this.loading = true;
		// this.global.httpPost()
	}
}
