import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
import { UserMedia } from '../models/userMedia.model';
import { GlobalService } from '../services/global.service';

@Component({
	selector: 'app-media',
	templateUrl: './media.page.html',
	styleUrls: ['./media.page.scss'],
})
export class MediaPage implements OnInit {
	@ViewChild('consultantSearchInput', { static: false }) consultantSearchInput: IonSearchbar;
	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/media', name: 'رسانه ها' },
	];
	mediaItems = [];
	loading = false;
	limit = 10;
	blogSideData = {};
	offset = 0;
	mediaCount: number = 0;
	p2: 1;
	consultantSearchLoading = false;
	consultantSearchResult: ConsultantSearch[] = [];
	searchTitle: string = '';
	selectedConsultant: ConsultantSearch;
	searchReq: any;
	mediaReq: any;
	disableMediaReq = false;
	constructor(private global: GlobalService) { }
	getMediaData(title?: string, userId?: number, date?: string) {
		const params = {
			limit: this.limit,
			offset: this.offset,
		};
		title ? params['title'] = title : '';
		userId ? params['user_id'] = userId : '';
		date ? params['date'] = date : '';
		this.loading = true;
		this.mediaCount = 0;
		this.mediaItems = [];
		this.mediaReq = this.global.httpPost('media', params).subscribe(res => {
			this.loading = false;
			this.mediaCount = res.user_media_count;
			this.mediaItems = res.user_media.map((seminar: UserMedia) =>
				new UserMedia().deserialize(seminar)
			);
		}, err => {
			this.loading = false;
			this.global.showError(err);
		})
	}
	ngOnInit() {
		this.getMediaData();
	}

	pageChange(ev) {
		this.p2 = ev;
		this.offset = (ev - 1) * this.limit;
		this.getMediaData(this.searchTitle, this.selectedConsultant?.id);
	}


	searchConsultant(ev) {
		if (ev.detail.value !== this.selectedConsultant?.fullname) {
			this.disableMediaReq = false;
			if (this.searchReq) {
				this.searchReq.unsubscribe();
			}
			this.consultantSearchLoading = true;
			if (ev.detail.value) {
				this.searchReq = this.global.httpPost('home/findConsultant', {
					search: ev.detail.value
				}).subscribe(res => {
					this.consultantSearchLoading = false;
					this.consultantSearchResult = res;
				}, err => {
					this.consultantSearchLoading = false;
					this.global.showError(err);
				});
			}
		}

	}
	searchMedia(ev) {
		this.searchTitle = ev.detail.value;
		this.getMediaData(this.searchTitle, this.selectedConsultant?.id);
	}

	filterByConsultant(item) {
		if (this.mediaReq) {
			this.mediaReq.unsubscribe();
		}
		this.selectedConsultant = item;
		this.consultantSearchResult = [];
		this.consultantSearchInput.value = item.fullname;
		this.disableMediaReq = true;
		this.getMediaData(this.searchTitle, this.selectedConsultant?.id);
	}

	deleteConsultant() {
		this.selectedConsultant = null;
		this.consultantSearchInput.value = '';
		this.getMediaData(this.searchTitle, this.selectedConsultant?.id);
	}

}

export interface ConsultantSearch {
	fullname: string;
	id: number;
}