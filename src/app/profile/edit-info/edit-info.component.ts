import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserInfo } from 'src/app/classes/UserInfo';
import { GlobalService } from 'src/app/services/global.service';
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
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/profile', name: 'پروفایل' },
		{ url: '/profile/editinfo', name: 'اطلاعات فردی' },
	];

	constructor(
		private balanceService: UserBalanceService,
		private global: GlobalService,
		private fb: FormBuilder
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
}