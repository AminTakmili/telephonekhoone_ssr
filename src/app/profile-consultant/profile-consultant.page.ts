import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../services/global.service";
import { SeoService } from "../services/seo.service";
import { UserBalanceService } from '../services/user-balance.service';

@Component({
  selector: "app-profile-consultant",
  templateUrl: "./profile-consultant.page.html",
  styleUrls: ["./profile-consultant.page.scss"],
})
export class ProfileConsultantPage implements OnInit {
  constructor(public global: GlobalService, public balanceService: UserBalanceService,private seo: SeoService,) { }

  ngOnInit() {
    this.setSeo(
      {
        metaTitle: 'پروفایل مشاور',
        isNoIndex: true
      }
    )
  }

  ionViewWillEnter() {
    this.setSeo(
      {
        metaTitle: 'پروفایل مشاور',
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
      keywords: data.metaKeywords.toString(),
      image: '/assets/img/icon/icon-384x384.png',
      isNoIndex: data.isNoIndex,
    });

  }
}
