import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonRadio, ModalController, NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { GlobalService } from 'src/app/services/global.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import * as _ from "lodash";
import { ActivatedRoute } from '@angular/router';

export interface MyFile {
	loading: boolean,
	file: any,
	loadPercent: number,
	fileType: string,
	id: number,
	apiResponse: any,
	fileKey: any
}

@Component({
	selector: 'app-new-media',
	templateUrl: './new-media.component.html',
	styleUrls: ['./new-media.component.scss'],
})
export class NewMediaComponent implements OnInit {
	@ViewChild('previewInput', { static: false }) previewInput: ElementRef;
	@ViewChild('mainInput', { static: false }) mainInput: ElementRef;
	@ViewChild('mediaType', { static: false }) mediaType: IonRadio;
	mediaForm: FormGroup;
	myId: any;
	editing = false;
	fileUploading = false;
	selectedType = '';
	pageTitle = '';
	selectedFiles = [];
	selectedPreview = [];
	selectedMain = [];
	dataType:Array<object>
	constructor(private activatedRoute: ActivatedRoute, private socketService: WebSocketService, private navCtrl: NavController, private fb: FormBuilder, public global: GlobalService) {
		this.myId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
		this.mediaForm = this.fb.group({
			title: [
				'',
				Validators.compose([
					Validators.required,
				]),
			],
			description: [
				'',
				Validators.compose([
					Validators.required,
				]),
			],
			price: [
				'',
				Validators.compose([
					Validators.required,
				]),
			],
			type: [
				'',
				Validators.compose([
					Validators.required,
				]),
			],
		});
	}

	loading = false;

	ngOnInit() {
		if (this.myId) {
			this.editing = true;
			this.getData();
		} else {
			this.pageTitle = 'ثبت رسانه جدید';
			this.editing = false;
		}
		this.getType()
	}

	getData() {
		this.global.showLoading().then(()=> {

			this.global.httpPost('userMedia/edit', {
				id: this.myId
			}).subscribe(res => {
				this.global.dismisLoading()
				this.mediaType.value = res.type;
				this.mediaForm.get('title').setValue(res.title);
				this.mediaForm.get('description').setValue(res.description);
				this.mediaForm.get('price').setValue(res.price);
				this.pageTitle = `ویرایش  ${res.title}`;
				res.media.map(item => {
					const file = {
						loading: false,
						file: {
							name: this.getFileName(item.path)
						},
						loadPercent: 100,
						fileType: 'file',
						id: new Date().getTime() + _.random(10000, 99999),
						apiResponse: {
							path: item.path,
							key: item.name
						},
						fileKey: item.name
					} as MyFile;
					this.selectedFiles.push(file);
					if (item.name === 'preview') {
						this.selectedPreview.push(file);
					} else {
						this.selectedMain.push(file);
					}
				})
			}, err => {
				this.global.dismisLoading()
				this.global.showError(err);
			});
		});
	}

	getFileName(path) {
		const pathArray = path.split('/');
		const index = pathArray.length - 1;
		return pathArray[index];
	}
	back() {
		this.navCtrl.navigateBack('/profile-consultant/media/archive');
	}
	onSubmit() {

	}

	typeChanged() {
		this.selectedFiles = [];
		this.selectedMain = [];
		this.selectedPreview = [];
	}

	openFile(event, fileKey) {
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
					fileKey: fileKey
				} as MyFile;
				this.selectedFiles.push(myFiles);
				if (myFiles.fileKey === 'preview') {
					this.selectedPreview.push(myFiles);
				} else {
					this.selectedMain.push(myFiles);
				}
				this.uploadImage(myFiles);
			});
		}
	}

	showTypeError() {
		this.global.showToast('لطفا ابتدا نوع رسانه را مشخص کنید', 2000, 'top');
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
					this.clearInputs('preview');
					this.fileUploading = false;
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
		if (item.fileKey === 'preview') {
			const previewIndex = this.selectedPreview.indexOf(item);
			this.selectedPreview.splice(previewIndex, 1);
			this.clearInputs('preview');
		} else {
			const mainIndex = this.selectedMain.indexOf(item);
			this.selectedMain.splice(mainIndex, 1);
			this.clearInputs('else');
		}
		if (item.req) {
			item.req.unsubscribe();
		}
	}

	clearInputs(option?: string) {
		if (option) {
			option == 'preview' ? this.previewInput.nativeElement.value = '' : this.mainInput.nativeElement.value = '';
		} else {
			this.previewInput.nativeElement.value = '';
			this.mainInput.nativeElement.value = '';
		}
	}

	placeHolderText(value, name) {
		const mediaType = value === 'video' ? 'ویدئو' : 'پادکست';
		if (!value) {
			return `برای آپلود ${name} اینجا کلیک کنید`;
		} else {
			return `برای آپلود ${name} ${mediaType} اینجا کلیک کنید.`;
		}

	}

	submitMediaForm() {
		if (!this.fileUploading) {
			this.global.validateAllFormFields(this.mediaForm);
			if (this.mediaForm.valid) {
				if (this.selectedPreview.length == 0) {
					this.global.showToast('آپلود پیش نمایش رسانه ضروری است', 2000, 'top', 'danger');
					return false;
				}
				if (this.selectedMain.length == 0) {
					this.global.showToast('آپلود رسانه اصلی ضروری است', 2000, 'top', 'danger');
					return false;
				}

				let filesArray = [];
				if (this.selectedFiles.length !== 0) {
					this.selectedFiles.map(file => {
						filesArray.push(file.apiResponse);
					});
					this.clearInputs();
				}
				const params = {
					category_item_id: this.mediaForm.get('type').value,
					title: this.mediaForm.get('title').value,
					description: this.mediaForm.get('description').value,
					type: this.mediaType.value,
					price: this.mediaForm.get('price').value,
					media: JSON.stringify(filesArray)
				}
				if (this.editing) {
					params['id'] = this.myId;
				}
				const requestUrl = this.editing ? 'userMedia/update' : 'userMedia/store';
				this.loading = true;
				this.global.httpPost(requestUrl, params).subscribe(res => {
					this.loading = false;
					this.navCtrl.navigateBack('/profile-consultant/media/archive');
					this.global.showToast(res.msg, 2000, 'top');
				}, err => {
					this.loading = false;
					this.global.showError(err);
				});
			}
		} else {
			this.global.showToast('لطفا تا پایان آپلود فایل منتظر بمانید', 2000, 'top');
		}


	}
	getType(){
		this.global.httpGet('userMedia').subscribe(
			async (res:any) => {
			console.log(res);	
			this.dataType=res
			},
			async (error:any) => {
				console.log(error);
			}
		)
	}

}
