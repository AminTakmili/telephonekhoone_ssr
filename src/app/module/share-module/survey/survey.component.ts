import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonTextarea, ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';

@Component({
	selector: 'app-survey',
	templateUrl: './survey.component.html',
	styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit {
	@ViewChild('rateDesc') rateDesc: IonTextarea;
	@Input() id;
	@Input() type;
	rate;
	rateItems = [];
	validateComment = false;
	loading = false;
	constructor(private global: GlobalService, private modalCtrl: ModalController) { }

	ngOnInit() {
		this.buildRateItems();
	}

	buildRateItems() {
		for (let i = 1; i <= 5; i++) {
			this.rateItems.push({
				rate: i,
				text: (i == 1 || i == 2) ? 'ضعیف' : (i == 3) ? 'متوسط' : (i == 4) ? 'خوب' : 'عالی'
			});
		}
	}
	onRate(ev) {
		this.rate = ev;
	}

	validateInput(rateDesc) {
		if (rateDesc.value !== '') {
			this.validateComment = false;
		} else {
			this.validateComment = true;
		}
	}

	submitRate() {
		if (this.rateDesc.value !== '') {
			this.loading = true;
			this.global.httpPost(this.type == 1 ? 'rateCall' : 'chats/rate', {
				id: this.id,
				rate: this.rate,
				description: this.rateDesc.value
			}).subscribe(res => {
				this.loading = false;
				this.global.showToast(res.msg, 2000, 'top');
				this.modalCtrl.dismiss('refresh');
			}, err => {
				this.global.showError(err);
				this.loading = false;
			});
		} else {
			this.validateComment = true;
		}
	}
	dismiss(){
		this.modalCtrl.dismiss();
	}
}
