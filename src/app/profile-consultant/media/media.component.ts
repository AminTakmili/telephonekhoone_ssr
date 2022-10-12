import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { SeoService } from 'src/app/services/seo.service';
import { NewMediaComponent } from './new-media/new-media.component';

// export interface MediaItems {

// }

@Component({
	selector: 'app-media',
	templateUrl: './media.component.html',
	styleUrls: ['./media.component.scss'],
})
export class MediaComponent implements OnInit {

	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/profile-consultant', name: 'پروفایل مشاور' },
		{ url: '/profile-consultant/media/archive', name: 'رسانه' },
	];

	constructor(private modalCtrl: ModalController,private seo: SeoService) { }

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



	newMedia() {
		this.modalCtrl.create({
			component: NewMediaComponent,
		}).then(modal => {
			modal.present();
		})
	}

}
