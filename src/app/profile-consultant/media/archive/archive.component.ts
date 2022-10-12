import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { SeoService } from 'src/app/services/seo.service';

@Component({
	selector: 'app-archive',
	templateUrl: './archive.component.html',
	styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit {

	mediaItems = [];
	limit = 10;
	offset = 0;
	loading = false;

	constructor(private global: GlobalService,private seo: SeoService) { }

	ngOnInit() {
		this.getMediaArchive();
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

	getMediaArchive() {
		this.loading = true;
		this.global.httpPost('userMedia', {
			limit: this.limit,
			offset: this.offset
		}).subscribe(res => {
			this.loading = false;
			this.mediaItems = res.user_media;
		}, err => {
			this.global.showError(err);
		})
	}

	getStatusColor(item) {
		return item.status == 'pending'
			? 'primary'
			: item.status == 'approved'
				? 'success'
				: 'danger';
	}
}
