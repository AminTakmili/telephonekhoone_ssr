import {Component, OnInit} from '@angular/core';
import {GlobalService} from '../services/global.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    aboutText = '';
    breadCrumb = [
        {url: '/', name: 'صفحه نخست'},
        {url: '/about', name: 'درباره ما'},
    ];

    constructor(private global: GlobalService) {
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        // this.global.showToast
        this.global.showLoading().then(() => {
            // loader.present();
            this.global.httpGet('more/about').subscribe(
                (res) => {
                    // loader.dismiss();
                    this.global.dismisLoading()
                    this.aboutText = res.msg;
                },
                (err) => {
                    this.global.dismisLoading()
                    this.global.showError(err);
                }
            );
        });
    }
}
