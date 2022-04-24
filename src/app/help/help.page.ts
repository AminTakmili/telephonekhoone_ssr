import {Component, OnInit} from '@angular/core';
import {GlobalService} from '../services/global.service';

@Component({
    selector: 'app-help',
    templateUrl: './help.page.html',
    styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
    constructor(private global: GlobalService) {
    }

    content = '';
    breadCrumb = [
        {url: '/', name: 'صفحه نخست'},
        {url: '/help', name: 'راهنما'},
    ];

    ngOnInit() {
        this.getHelpData();
    }

    getHelpData() {
        this.global.showLoading().then(() => {
            this.global.httpGet('more/help').subscribe(
                (res) => {
                    // console.log(res);
                    this.global.dismisLoading()
                    this.content = res.msg;
                },
                (err) => {
                    this.global.showError(err);
                    this.global.dismisLoading()

                }
            );
        });
    }
}
