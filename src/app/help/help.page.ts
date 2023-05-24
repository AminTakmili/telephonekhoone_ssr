import {Component, OnInit} from '@angular/core';
import {GlobalService} from '../services/global.service';
import { SeoService } from '../services/seo.service';

@Component({
    selector: 'app-help',
    templateUrl: './help.page.html',
    styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
    constructor(
        private global: GlobalService,
        public seo: SeoService,
        ) {
    }

    content = '';
    breadCrumb = [
        {url: '/', name: 'تلفن خونه'},
        {url: '/help', name: 'راهنما'},
    ];

    ngOnInit() {
        this.getHelpData();
        this.setSeo(
            {
              metaTitle:'راهنما',
              metaDescription:'راهنما تلفن خونه',
              metaKeywords:'راهنما,راهنما تلفن خونه, راهنما مشاوره',
              isNoIndex:false

            }
            )
    }
    ionViewWillEnter() {
		// console.log("object");

        this.setSeo(
            {
              metaTitle:'راهنما',
              metaDescription:'راهنما تلفن خونه',
              metaKeywords:'راهنما,راهنما تلفن خونه, راهنما مشاوره',
              isNoIndex:false

            }
            )
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
    setSeo(data) {
        // console.log(data);
      this.seo.generateTags({
          title: data.metaTitle,
          description: data.metaDescription,
          canonical: data.canonicalLink,
          keywords: data.metaKeywords.toString(),
          image: '/assets/img/icon/icon-384x384.png',
          isNoIndex: data.isNoIndex,
      });

  }
}
