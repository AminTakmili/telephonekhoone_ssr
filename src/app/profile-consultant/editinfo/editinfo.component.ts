import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { UserBalanceService } from 'src/app/services/user-balance.service';
import { SpecialtyComponent } from '../../components/specialty/specialty.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HttpEventType } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-editinfo',
	templateUrl: './editinfo.component.html',
	styleUrls: ['./editinfo.component.scss'],
})
export class EditinfoComponent implements OnInit {
	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/profile-consultant', name: 'پروفایل مشاور' },
		{ url: '/profile-consultant/editinfo', name: 'اطلاعات فردی' },
	];
	selectedResumeFile: any = null;
	submitLoading = false;
	public Editor = ClassicEditor;
	itemsValidation = {
		resumeFileValidation: false,
		profileValidation: false,
		personalCardValidation: false,
		documentValidation: false,
	}
	fillForms = false;
	profileLoading = false;
	ckConfig = {
		toolbar: {
			items: [
				'heading',
				'|',
				'bold',
				'italic',
				'|',
				'bulletedList',
				'numberedList',
				'|',
				'insertTable',
				'|',
				'undo',
				'redo',
			],
		},
		image: {
			toolbar: [
				'imageStyle:full',
				'imageStyle:side',
				'|',
				'imageTextAlternative',
			],
		},
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
		},
		language: 'fa',
		height: '500px',
	};
	cardLoading = false;
	docLoading = false;
	aboutData = '';
	selectedCategory: any;
	childrenValues = [];
	childrenNames: any;
	signUpForm: FormGroup;
	documentImage: any;
	personalCardImage: any;
	profileImage: any;
	userInfo: any;
	imgResultBeforeCompress = '';
	imgResultAfterCompress = '';

	categories: any;
	countries: any;

	constructor(
		private fb: FormBuilder,
		public modalController: ModalController,
		public global: GlobalService,
		private imageCompress: NgxImageCompressService,
		public balance: UserBalanceService
	) {
		this.userInfo = this.global.getUserInfo();
		const userInfo = this.global.getUserInfo();
		this.signUpForm = this.fb.group({
			fullName: [userInfo?.name, Validators.compose([Validators.required])],
			gender: [userInfo?.gender, Validators.compose([Validators.required])],
			country: [userInfo?.country?.id, Validators.compose([Validators.required])],
			aboutData: [userInfo?.description, Validators.compose([Validators.required])],
			shaba: [userInfo?.card?.shaba, Validators.compose([Validators.required])],
			experienceYear: [userInfo?.experience_year, Validators.compose([Validators.required])],
			lastCertificate: [userInfo?.last_certificate, Validators.compose([Validators.required])],
			accountNumber: [
				userInfo?.card?.number,
				Validators.compose([Validators.required]),
			],
			cardNumber: [
				userInfo?.card?.card,
				Validators.compose([Validators.required]),
			],
			personalCode: [userInfo.personal_code, Validators.compose([Validators.required])],
			bankName: [userInfo?.card?.name, Validators.compose([Validators.required])],
		});
	}


	ngOnInit() {
		this.getCategories();
	}

	async onspecialty(ev: MouseEvent) {
		const target = ev.target['tagName'];
		const excludedTargets = ['ION-ICON', 'ION-LABEL', 'ION-CHIP'];
		if (excludedTargets.indexOf(target) === -1) {
			const modal = await this.modalController.create({
				component: SpecialtyComponent,
				cssClass: 'modal-style1',
				componentProps: {
					categories: this.categories,
					selectedCategory: this.selectedCategory,
					selectedChildes: this.childrenValues,
				},
			});
			modal.onDidDismiss().then((data) => {
				if (data.data) {
					this.fillForms = false;
					const parentCategory = data.data.parent;
					const childrenCategories = data.data.children;
					this.childrenValues = childrenCategories;
					let result = parentCategory.children.filter((x) =>
						childrenCategories.some((y) => x.id === y)
					);
					this.childrenNames = result;
					this.selectedCategory = data.data.parent;
				}
			});
			return await modal.present();
		}
	}

	showChilds() {
		let selected = [];
		if (this.childrenNames) {
			this.childrenNames.map((child) => {
				selected.push(child.name);
			});
			return this.childrenNames;
		}
	}

	removeChild(id) {
		if (this.childrenValues.length > 1) {
			const valuesIndex = this.childrenValues.indexOf(id);
			const namesIndex = this.childrenNames.findIndex((item) => item.id == id);
			this.childrenValues.splice(valuesIndex, 1);
			this.childrenNames.splice(namesIndex, 1);
		} else {
			this.global.showToast(
				'حد اقل یک دسته بندی باید انتخاب شده باشد',
				2000,
				'top',
				'danger'
			);
		}
	}

	getCategories() {
		this.global.getUserInfo().media.map(mediaItem => {
			switch (mediaItem.name) {
				case 'profile':
					this.profileImage = {
						key: 'profile',
						path: mediaItem.path
					}
					break;
				case 'resume':
					this.selectedResumeFile = {
						key: 'resume',
						path: mediaItem.path
					}
					break;
				case 'personal_card':
					this.personalCardImage = {
						key: 'personal_card',
						path: mediaItem.path
					}
					break;
				case 'document':
					this.documentImage = {
						key: 'document',
						path: mediaItem.path
					}
					break;
			}
		});
		const countryReq = this.global.httpGet('getCountries');
		this.global.showLoading().then(() => {
			countryReq.subscribe(
				(countries) => {
					this.global.dismisLoading()
					this.countries = countries;
					setTimeout(() => {
						this.signUpForm.get('country').setValue(this.userInfo?.country?.id);
					}, 100);
				},
				(err) => {
					this.global.dismisLoading()
					this.global.showError(err);
				}
			);
		});
	}

	submitForm() {
		const signForm = this.signUpForm;
		this.global.validateAllFormFields(signForm);
		// if (!this.selectedCategory.name) {
		// 	this.fillForms = true;
		// } else {
		// 	this.fillForms = false;
		// }
		let userData = new FormData();
		this.childrenValues.map((x, i) => {
			userData.append(`child_category_item_id[${i}]`, `${x}`);
		});

		if (
			signForm.valid &&
			this.childrenValues &&
			this.profileImage &&
			this.personalCardImage &&
			this.documentImage &&
			this.selectedResumeFile
		) {
			userData.append('fullname', signForm.get('fullName').value);
			userData.append('gender', signForm.get('gender').value);
			userData.append('country', signForm.get('country').value);
			userData.append('description', signForm.get('aboutData').value);
			userData.append('shaba', signForm.get('shaba').value);
			userData.append('number', signForm.get('accountNumber').value);
			userData.append('card', signForm.get('cardNumber').value);
			userData.append('name', signForm.get('bankName').value);
			userData.append('experience_year', signForm.get('experienceYear').value);
			userData.append('last_certificate', signForm.get('lastCertificate').value);
			userData.append('profile', JSON.stringify(this.profileImage));
			if (this.selectedResumeFile) {
				userData.append('resume', JSON.stringify(this.selectedResumeFile));
			}
			userData.append(
				'personal_card',
				JSON.stringify(this.personalCardImage)
			);
			userData.append('document', JSON.stringify(this.documentImage));
				this.submitLoading = true;
			this.global.httpPost('profile/editInfoConsultant', userData).subscribe(
				(res) => {
					this.submitLoading = false;
					this.global.showToast(res.msg, 2000, 'top');
				},
				(err) => {
					this.submitLoading = false;
					this.global.showError(err);
				}
			);
		} else {
			this.global.showToast(
				'لطفا اطلاعات خواسته شده را تکمیل فرمایید ',
				2000,
				'top',
				'danger'
			);
		}
	}

	uploadImage_click(type) {
		this.imageCompress.uploadFile().then(({ image, orientation }) => {
			this.imagesLoading(type, true);
			this.imgResultBeforeCompress = image;
			this.imageCompress
				.compressFile(image, orientation, 50, 50)
				.then((result) => {
					let file = new File(
						[this.convertDataUrlToBlob(result)],
						this.getRandomString(6) + '.jpg',
						{ type: 'image/jpg' }
					);
					this.imgResultAfterCompress = result;
					let formData = new FormData();
					formData.append('image', file);
					formData.append('key', type);
					this.global
						.httpUpload('saveImage', formData)
						.pipe(
							map((evt) => {
								switch (evt.type) {
									case HttpEventType.UploadProgress:
										const progress = evt.loaded / evt.total;
										return { status: 'progress', message: progress };
									case HttpEventType.Response:
										return evt.body;
									default:
										return `Unhandled event: ${evt.type}`;
								}
							})
						)
						.subscribe(
							(res) => {
								if (res.key != undefined) {
									this.imagesLoading(type, false);
									res.key == 'document'
										? (this.documentImage = res)
										: res.key == 'personal_card'
											? (this.personalCardImage = res)
											: (this.profileImage = res);
								}
							},
							(error) => {
								this.imagesLoading(type, false);
								this.global.showError(error);
							}
						);
				});
		});
	}

	imagesLoading(type, val) {
		type == 'personal_card'
			? (this.cardLoading = val)
			: type == 'document'
				? (this.docLoading = val)
				: (this.profileLoading = val);
	}

	getRandomString(length) {
		var randomChars =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var result = '';
		for (var i = 0; i < length; i++) {
			result += randomChars.charAt(
				Math.floor(Math.random() * randomChars.length)
			);
		}
		return result;
	}

	convertDataUrlToBlob(dataUrl): Blob {
		const arr = dataUrl.split(',');
		const mime = arr[0].match(/:(.*?);/)[1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return new Blob([u8arr], { type: mime });
	}

	setResumeFiles(files) {
		if (files.length > 0) {
			this.selectedResumeFile = files[0];
			this.itemsValidation.resumeFileValidation = false;

		} else {
			this.selectedResumeFile = null;
		}

	}

}
