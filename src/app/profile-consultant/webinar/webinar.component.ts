import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { SeoService } from 'src/app/services/seo.service';

@Component({
    selector: 'app-webinar',
    templateUrl: './webinar.component.html',
    styleUrls: ['./webinar.component.scss'],
})
export class WebinarComponent implements OnInit {
    breadCrumb = [{ url: '/', name: 'صفحه نخست' }];
    constructor(public global: GlobalService,private seo: SeoService,) { }

    ngOnInit() {
        this.setSeo(
            {
                metaTitle: 'اطلاعات فردی',
                isNoIndex: true
            }
        )
    }

    ionViewWillEnter() {
        this.setSeo(
            {
                metaTitle: 'اطلاعات فردی',
                isNoIndex: true
            }
        )
    }
    
    setSeo(data) {
        console.log(data);
        this.seo.generateTags({
            title: data.metaTitle,
            description: data.metaDescription,
            canonical: data.canonicalLink,
            // keywords: data.metaKeywords.toString(),
            image: '/assets/img/icon/icon-384x384.png',
            isNoIndex: data.isNoIndex,
        });

    }
}
