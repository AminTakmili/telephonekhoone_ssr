import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'app-webinar',
    templateUrl: './webinar.component.html',
    styleUrls: ['./webinar.component.scss'],
})
export class WebinarComponent implements OnInit {
    breadCrumb = [{ url: '/', name: 'صفحه نخست' }];
    constructor(public global: GlobalService) {}

    ngOnInit() {}
}
