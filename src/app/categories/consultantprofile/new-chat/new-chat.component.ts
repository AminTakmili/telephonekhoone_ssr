import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { GlobalService } from '../../../services/global.service';
import * as _ from "lodash";

@Component({
	selector: 'app-new-chat',
	templateUrl: './new-chat.component.html',
	styleUrls: ['./new-chat.component.scss'],
})
export class NewChatComponent implements OnInit {
	@Input() consultantName;
	@Input() categoryName;
	@Input() planId;
	@Input() consultantText;
	@Input() itemType;
	@ViewChild('fileInput') fileInput;
	loading = false;
	messageTextValue = '';
	selectedFiles = [];
	constructor(
		private modalCtrl: ModalController,
		private global: GlobalService
	) { }

	ngOnInit() { }

	close() {
		this.modalCtrl.dismiss();
	}


	formSubmit(text?) {
		this.loading = true;
		const dataForm = new FormData;
		dataForm.append('message', this.messageTextValue);
		dataForm.append('plan_id', this.planId);
		dataForm.append('back_url', this.global.backUrl);
		if (this.selectedFiles.length !== 0) {
			dataForm.append('chat_file', JSON.stringify(this.selectedFiles[0].apiResponse));
		}
		this.global
			.httpPost(this.itemType === 'chat' ? 'chats/create' : 'requestCall', dataForm)
			.subscribe(
				(res) => {
					this.loading = false;
					this.modalCtrl.dismiss(res);
				},
				(err) => {
					this.global.showError(err);
					this.modalCtrl.dismiss('error');
					this.loading = false;
				}
			);
	}

	removeFile(item) {
		const fileIndex = this.selectedFiles.indexOf(item);
		this.selectedFiles.splice(fileIndex, 1);
		item.req.unsubscribe();
	}

	openFile(event) {
		this.selectedFiles.map(items => {
			items.apiResponse.unsubscribe();
		});
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
					apiResponse: null
				}
				this.selectedFiles = [myFiles];
				this.uploadImage(myFiles);
			});
		}
	}

	uploadImage(item) {
		const formData = new FormData;
		formData.append('file', item.file);
		formData.append('key', item.file.name);
		item.req = this.global.httpUpload('chats/saveFile', formData).pipe(
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
						this.fileInput.nativeElement.value = null;
					}
				} else {
					item.apiResponse = res;
					item.loading = false;
					this.fileInput.nativeElement.value = null;
				}
			}
		}, err => {
			item.loading = false;
			this.global.showError(err);
		})
	};

}
