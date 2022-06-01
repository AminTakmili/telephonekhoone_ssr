import {Component, OnInit} from '@angular/core';
import {GlobalService} from 'src/app/services/global.service';
import { SeoService } from 'src/app/services/seo.service';

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

    constructor(private global: GlobalService,		
        
        public seo: SeoService,
        ) {
    }

    ngOnInit() {
        this.setSeo(
            {
              metaTitle:'پکیج های مشاوره',
              metaDescription:'پکیج های مشاوره تلفن خونه',
              metaKeywords:'پکیج های مشاوره,پکیج های مشاوره تلفن خونه, پکیج های مشاوره ',
              isNoIndex:false

            }
            )
    }

	getReserveData() {
		this.loading = true;
		// this.global.httpPost()
	}
    ionViewWillEnter() {
		// console.log("object");
       
        this.setSeo(
            {
              metaTitle:'پکیج های مشاوره',
              metaDescription:'پکیج های مشاوره تلفن خونه',
              metaKeywords:'پکیج های مشاوره,پکیج های مشاوره تلفن خونه, پکیج های مشاوره ',
              isNoIndex:false

            }
            )
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
