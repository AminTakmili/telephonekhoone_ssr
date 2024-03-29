import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ImageGalleryComponent } from 'src/app/components/image-gallery/image-gallery.component';
import { GlobalService } from 'src/app/services/global.service';
import { SeoService } from 'src/app/services/seo.service';

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
	breadCrumb = [{ url: '/', name: 'تلفن خونه' }, { url: '/profile-consultant/withdraw', name: 'برداشت از حساب' }];
	loading = false;
	limit = 10;
	offset = 0;
	historyList: WithdrawHistory[] = [];
	constructor(private global: GlobalService, private modalCtrl: ModalController, private navCtrl: NavController, private seo: SeoService,) { }

	ngOnInit() {
		this.setSeo(
			{
				metaTitle: 'برداشت از حساب',
				isNoIndex: true
			}
		)
	}

	ionViewWillEnter() {
		this.getData();
		this.setSeo(
			{
				metaTitle: 'برداشت از حساب',
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

	getData() {
		this.loading = true
		this.global
			.httpPost("profile/cashouts", {
				limit: this.limit,
				offset: this.offset
			}).subscribe(
				(res) => {
					this.historyList = res;
					this.loading = false
				},
				(err) => {
					this.loading = false
					this.global.showError(err);
				}
			);
	}

	async openGallery(media) {
		if (media) {
			const images = [media.options.subSizes.large ? media.options.subSizes.large : media.options.subSizes.medium ? media.options.subSizes.medium : media.options.subSizes.thumbnail]
			const modal = await this.modalCtrl.create({
				component: ImageGalleryComponent,
				mode: 'md',
				componentProps: { galleryImages: images, index: 0 },
				cssClass: 'galleryModal',
			});
			await modal.present();
		}
	}

	getStatusColor(status) {
		return status == 'pending'
			? 'primary'
			: status == 'accepted'
				? 'success'
				: status == 'onCall'
					? 'secondary'
					: status == 'ended'
						? 'medium'
						: 'danger'
	}

	back() {
		this.navCtrl.navigateBack('/profile-consultant/withdraw');
	}
}


interface WithdrawHistory {
	amount: number;
	created_at: string;
	decline_reason: string;
	id: number;
	media: any;
	status: string;
	status_text: string;
}
