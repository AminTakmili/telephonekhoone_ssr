import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserInfo } from 'src/app/classes/UserInfo';
import { GlobalService } from 'src/app/services/global.service';
import { SeoService } from 'src/app/services/seo.service';
import { UserBalanceService } from 'src/app/services/user-balance.service';

@Component({
	selector: 'app-edit-info',
	templateUrl: './edit-info.component.html',
	styleUrls: ['./edit-info.component.scss'],
})
export class EditInfoComponent implements OnInit {
	balance = 0;
	editInfoForm: FormGroup;
	loading = false;
	breadCrumb = [
		{ url: '/', name: 'تلفن خونه' },
		{ url: '/profile', name: 'پروفایل' },
		{ url: '/profile/editinfo', name: 'اطلاعات فردی' },
	];

	constructor(
		private balanceService: UserBalanceService,
		private global: GlobalService,
		private fb: FormBuilder,
		public seo: SeoService,

	) {
		this.editInfoForm = this.fb.group({
			fullName: [this.global.getUserInfo().name, Validators.compose([Validators.required])],
			gender: [this.global.getUserInfo().gender, Validators.compose([Validators.required])],
		});
		this.balanceService.getUserBalance().subscribe((res) => {
			this.balance = res;
		});
	}

	ngOnInit() {
		this.setSeo(
			{
				metaTitle: 'اطلاعات فردی',
				metaDescription: 'اطلاعات فردی کاربر تلفن خونه',
				metaKeywords: 'اطلاعات فردی,اطلاعات فردی تلفن خونه, اطلاعات فردی مشاوره',
				isNoIndex: true
			}
		)
	}

	ionViewWillEnter() {
		this.setSeo(
			{
				metaTitle: 'اطلاعات فردی',
				metaDescription: 'اطلاعات فردی کاربر تلفن خونه',
				metaKeywords: 'اطلاعات فردی,اطلاعات فردی تلفن خونه, اطلاعات فردی مشاوره',
				isNoIndex: true
			}
		)
	}

	editInfo() {
		const fullName = this.editInfoForm.get('fullName').value;
		const gender = this.editInfoForm.get('gender').value;
		this.loading = true;
		this.global
			.httpPost('profile/editInfoUser', {
				fullname: fullName,
				gender: gender,
			})
			.subscribe(
				async (res) => {
					this.global.showToast(res.msg, 2000, 'top');
					this.loading = false;
					const userInfo = {
						mobile: this.global.getUserInfo().mobile,
						fullname: fullName,
						gender: gender,
						id: this.global.getUserInfo().id,
					}
					this.global.setUserInfo(userInfo);
				},
				(error) => {
					this.loading = false;
					this.global.showError(error);
				}
			);
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
}
