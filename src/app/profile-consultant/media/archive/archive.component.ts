import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

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
	constructor(private global: GlobalService) { }

	ngOnInit() {
		this.getMediaArchive();
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
