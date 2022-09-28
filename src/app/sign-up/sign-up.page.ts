import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { SpecialtyComponent } from '../components/specialty/specialty.component';
import { GlobalService } from '../services/global.service';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgxImageCompressService } from 'ngx-image-compress';
import { HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RulesPage } from '../rules-component/rules.page';
import { SeoService } from '../services/seo.service';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.page.html',
	styleUrls: ['./sign-up.page.scss'],

})
export class SignUpPage implements OnInit {
	public Editor = ClassicEditor;
	fillForms = false;
	isChecked = false;
	resumeFileValidate = false;
	profileLoading = false;
	itemsValidation = {
		resumeFileValidation: false,
		profileValidation: false,
		personalCardValidation: false,
		documentValidation: false,
	}
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
	childValuesForm: FormGroup;
	documentImage: any;
	personalCardImage: any;
	profileImage: any;
	imgResultBeforeCompress = '';
	imgResultAfterCompress = '';
	page = 0;
	selectedResumeFile: any = null;

	// validationItems

	categoryValidate = false;
	childrenValidate = false;


	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/sign-up', name: 'ثبت نام مشاور' },
	];
	categories: any;
	countries: any;

	constructor(
		private fb: FormBuilder,
		public modalController: ModalController,
		public global: GlobalService,
		private imageCompress: NgxImageCompressService,
		private navCtrl: NavController,
		private seo: SeoService,
	) {
		this.signUpForm = this.fb.group({
			fullName: ['', Validators.compose([Validators.required])],
			gender: ['', Validators.compose([Validators.required])],
			country: ['', Validators.compose([Validators.required])],
			aboutData: ['', Validators.compose([Validators.required])],
			shaba: ['', Validators.compose([Validators.required])],
			accountNumber: ['', Validators.compose([Validators.required])],
			cardNumber: ['', Validators.compose([Validators.required])],
			bankName: ['', Validators.compose([Validators.required])],
			experienceYear: ['', Validators.compose([Validators.required])],
			lastCertificate: ['', Validators.compose([Validators.required])],
			// callAmount: ['', Validators.compose([Validators.required])],
			// chatAmount: ['', Validators.compose([Validators.required])],
		});
	}


	ngOnInit() {
		this.getCategories();
		this.setSeo(
			{
				metaTitle: 'ثبت نام',
				metaDescription: 'ثبت نام در تلفن خونه',
				metaKeywords: 'ثبت نام,ثبت نام تلفن خونه, ثبت نام مشاوره',
				isNoIndex: true
			}
		)
	}

	generateDynamicForm() {
		const group: any = {};

		this.childrenNames.forEach(question => {
			group['call' + question.id] = new FormControl('', Validators.required);
			group['message' + question.id] = new FormControl('', Validators.required);
		});

		const formGroup = new FormGroup(group);
		this.childValuesForm = formGroup;
		this.page = 1;
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

	setResumeFiles(files) {
		if (files.length > 0) {
			this.selectedResumeFile = files[0];
			this.itemsValidation.resumeFileValidation = false;
			
		} else {
			this.selectedResumeFile = null;
		}

	}

	async rulesCheck() {
		const modal = await this.modalController.create({
			component: RulesPage,
		});

		await modal.present();
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
			const namesIndex = this.childrenNames.findIndex(
				(item) => item.id == id
			);
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
		const catReq = this.global.httpGet('registerCategories');
		const countryReq = this.global.httpGet('getCountries');
		this.global.showLoading().then(() => {
			this.global.parallelRequest([catReq, countryReq]).subscribe(
				([categories, countries='']) => {
					this.global.dismisLoading()
					this.categories = categories;
					this.countries = countries;
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
		const pricesForm = this.childValuesForm;
		this.global.validateAllFormFields(pricesForm);
		let prices = [];
		for (let key in pricesForm.value) {
			const categoryPrice = {};
			const callItem = this.childrenNames.find(x => `call${x.id}` == key);

			if (callItem) {
				categoryPrice['category_item_id'] = callItem.id;
				categoryPrice['price'] = parseInt(pricesForm.value[`call${callItem.id}`], 10) || '';
				categoryPrice['chat_price'] = parseInt(pricesForm.value[`message${callItem.id}`], 10) || '';
				prices.push(categoryPrice);
			}
		}

		let userData = new FormData();
		this.childrenValues.map((x, i) => {
			userData.append(`child_category_item_id[${i}]`, `${x}`);
		});
		userData.append('prices', JSON.stringify(prices));
		if (this.isChecked) {
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
			userData.append('category_item_id', this.selectedCategory.id);

			this.global.showLoading().then(() => {
				this.global
					.httpPost('registerConsultant', userData)
					.subscribe(
						(res) => {
							this.global.dismisLoading()
							this.global.showToast(res.msg, 2000, 'top');
							this.navCtrl.navigateRoot('/');
							this.global.changeLogin(true);
						},
						(err) => {
							this.global.dismisLoading()
							this.global.showError(err);
						}
					);
			});
		} else {
			this.global.showToast(
				'مطالعه قوانین الزامی است',
				2000,
				'top',
				'danger'
			);
		}
	}

	changePage(number) {
		if (number == 1) {
			const signForm = this.signUpForm;
			if (!this.selectedCategory?.name) {
				this.fillForms = true;
			} else {
				this.fillForms = false;
			}
			this.global.validateAllFormFields(signForm);
			if (
				signForm.valid &&
				this.selectedCategory &&
				this.childrenValues &&
				this.profileImage &&
				this.personalCardImage &&
				this.documentImage &&
				this.selectedResumeFile
			) {
				this.generateDynamicForm();
			} else {
				if (signForm.valid) {
					if (!this.profileImage) {
						this.global.showToast('تصویر مشاور الزامی است', 2000, 'top', 'danger');
					} else if (!this.personalCardImage) {
						this.global.showToast('تصویر کارت ملی الزامی است', 2000, 'top', 'danger');
					} else if (!this.documentImage) {
						this.global.showToast('تصویر مدرک الزامی است', 2000, 'top', 'danger');
					}
				}
				const items = [
					{
						name: 'resumeFileValidation',
						obj: this.selectedResumeFile
					},
					{
						name: 'profileValidation',
						obj: this.profileImage
					},
					{
						name: 'personalCardValidation',
						obj: this.personalCardImage
					},
					{
						name: 'documentValidation',
						obj: this.documentImage
					},
				];
				const shouldFill = [];
				items.map(validateItem => {
					if (!validateItem.obj) {
						shouldFill.push(validateItem.name);
					}
				});
				this.validateItems(shouldFill);
			}
		} else {
			this.page = number;
		}
	}

	changeCheck() {
		this.isChecked = !this.isChecked;
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
										return {
											status: 'progress',
											message: progress,
										};
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
										? (this.documentImage = res, this.itemsValidation.documentValidation = false)
										: res.key == 'personal_card'
											? (this.personalCardImage = res, this.itemsValidation.personalCardValidation = false)
											: (this.profileImage = res, this.itemsValidation.profileValidation = false);
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

	validateItems(items) {
		for (var key in this.itemsValidation) this.itemsValidation[key] = false;
		items.map(val => {
			this.itemsValidation[val] = true;
		});
	}

	setSeo(data) {
		// console.log(data);
		this.seo.generateTags({
			title: data.metaTitle,
			description: data.metaDescription,
			canonical: data.canonicalLink,
			keywords: data.metaKeywords.toString(),
			image: '/assets/img/icon/icon-384x384.png',
			isNoIndex: data.isNoIndex,
		});
	}
}
