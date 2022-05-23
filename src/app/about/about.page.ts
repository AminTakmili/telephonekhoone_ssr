import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  aboutText = '';
  breadCrumb = [
    { url: '/', name: 'صفحه نخست' },
    { url: '/about', name: 'درباره ما' },
  ];

  constructor(
    public seo: SeoService,

    private global: GlobalService
  ) {}

  ngOnInit() {
    console.log('object');
    this.getData();
  }

  getData() {
    // this.global.showToast
    this.global.showLoading().then(() => {
      // loader.present();
      this.global.httpGet('more/about').subscribe(
        (res) => {
        //   console.log(res);
          // loader.dismiss();
          this.global.dismisLoading();
          this.aboutText = res.msg;
          this.setSeo({
            metaTitle: res['seo']?.title,
            metaDescription: res['seo']?.description,
            metaKeywords: res['seo']?.keywords,
            isNoIndex: false,
          });
        },
        (err) => {
          this.global.dismisLoading();
          this.global.showError(err);
        }
      );
    });
  }

  setSeo(data) {
    this.seo.generateTags({
      title: data.metaTitle,
      description: data.metaDescription,
      keywords: data.metaKeywords,
      image: 'src/assets/img/professional.png',
      isNoIndex: data.isNoIndex,
    });
  }
}
