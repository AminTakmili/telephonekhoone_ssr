import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { SeoService } from '../services/seo.service';
import { UserBalanceService } from '../services/user-balance.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  constructor(
    public global: GlobalService,
    public balanceService: UserBalanceService,
    public seo: SeoService
  ) {}

  ngOnInit() {
    
    this.setSeo({
      metaTitle: 'ورود',
      metaDescription: 'ورود به تلفن خونه',
      metaKeywords: 'ورود,ورود تلفن خونه, ورود مشاوره',
      isNoIndex: true,
    });
  }
  ionViewWillEnter() {
    // console.log('object');
    this.setSeo({
      metaTitle: 'ورود',
      metaDescription: 'ورود به تلفن خونه',
      metaKeywords: 'ورود,ورود تلفن خونه, ورود مشاوره',
      isNoIndex: true,
    });
  }

  setSeo(data) {
    // console.log(data);
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
