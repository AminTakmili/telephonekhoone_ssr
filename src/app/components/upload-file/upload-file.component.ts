import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import * as _ from "lodash";
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-upload-file',
	templateUrl: './upload-file.component.html',
	styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit {
	@Input() key;
	@Input() type;
	@Input() title;
	@Input() description;
	@Input() multiple;
	@Input() defaultFiles;
	@ViewChild('fileInput') fileInput;
	@Output() exportDataEmitter = new EventEmitter<any>();
	selectedFiles = [];
	fileUploading = false;
	constructor(private global: GlobalService) { }

	ngOnInit() {
		this.setDefaultFiles();
	}

	setDefaultFiles() {
		if (this.defaultFiles) {
			this.defaultFiles.map(files => {
				const myFiles = {
					loading: false,
					file: {
						name: this.getFileName(files.path)
					},
					loadPercent: 0,
					fileType: 'file',
					id: new Date().getTime() + _.random(10000, 99999),
					apiResponse: files,
					fileKey: files.key
				} as MyFile;
				this.selectedFiles.push(myFiles);
			});
		}
	}

	getFileName(link) {
		const splitLink = link.split('/');
		return splitLink[splitLink.length - 1];
	}

	clickUploadInput(event) {
		if (event !== 'ION-BUTTON') {
			if (this.multiple) {
				this.fileInput.nativeElement.click();
			} else if (this.selectedFiles.length <= 0) {
				this.fileInput.nativeElement.click();
			}
		};
	}

	openFile(event) {
		let input = event.target;
		if (input.files.length !== 0) {
			Object.keys(input.files).map((key, index) => {
				const element = input.files[key];
				const myFiles = {
					loading: true,
					file: element,
					loadPercent: 0,
					fileType: 'file',
					id: new Date().getTime() + _.random(10000, 99999),
					apiResponse: null,
					fileKey: this.key
				} as MyFile;
				this.selectedFiles.push(myFiles);
				this.uploadImage(myFiles);
			});
		}
	}


	uploadImage(item) {
		this.fileUploading = true;
		const formData = new FormData;
		formData.append('file', item.file);
		formData.append('key', item.fileKey);
		item.req = this.global.httpUpload('saveFile', formData).pipe(
			map((event) => {
				if (event.type === HttpEventType.UploadProgress) {
					const percentDone = Math.round(100 * event.loaded / event.total);
					return { status: 'progress', message: percentDone };
				}
				if (event.type === HttpEventType.Response) {
					return event.body;
				}
			}),
		).subscribe(res => {
			if (res) {
				if (res.status === 'progress' && res.message) {
					item.loadPercent = res.message;
					if (res.message === 100) {
						item.loading = false;
					}
				} else {
					item.apiResponse = res;
					this.clearInputs();
					this.fileUploading = false;
					this.exportFiles();
					item.loading = false;
				}
			}
		}, err => {
			item.loading = false;
			this.global.showError(err);
		})
	};

	removeFile(item) {
		const fileIndex = this.selectedFiles.indexOf(item);
		this.selectedFiles.splice(fileIndex, 1);
		this.clearInputs();
		if (item.req) {
			item.req.unsubscribe();
		}
		this.exportFiles();
	}

	clearInputs() {
		this.fileInput.nativeElement.value = '';
	}

	exportFiles() {
		let fileApiResponses = [];
		this.selectedFiles.map(item => {
			fileApiResponses.push(item.apiResponse);
		});
		this.exportDataEmitter.emit(fileApiResponses);
	}

}

interface MyFile {
	loading: boolean,
	file: any,
	loadPercent: number,
	fileType: string,
	id: number,
	apiResponse: any,
	fileKey: any
}