import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ThumbnailService {
	iconList = [ // array of icon class list based on type
		{ type: "xlsx", icon: "document-outline" },
		{ type: "pdf", icon: "document-outline" },
		{ type: "jpg", icon: "image-outline" },
		{ type: "png", icon: "image-outline" },
		{ type: "image/png", icon: "image-outline" },
		{ type: "image/jpeg", icon: "image-outline" },
		{ type: "video/mp4", icon: "videocam-outline" }
	];
	constructor() { }

	getMimeTypeIcon(filename) { // this will give you icon class name
		if (filename) {
			let ext = filename.split(".").pop();
			let obj = this.iconList.filter(row => {
				if (row.type === ext) {
					return true;
				}
			});
			if (obj.length > 0) {
				let icon = obj[0].icon;
				return icon;
			} else {
				return "document-outline";
			}
		}
	}
}
