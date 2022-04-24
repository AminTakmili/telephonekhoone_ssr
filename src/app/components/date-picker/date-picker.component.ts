import {
	Component,
	Input,
	OnInit,
	SimpleChanges,
	ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavParams, PopoverController } from "@ionic/angular";
import { GlobalService } from "src/app/services/global.service";
import * as pickerAnimation from "src/app/animations/picker";
import { Reserve } from "src/app/models/reserve.model";
import { ScreensizeService } from 'src/app/services/screensize.service';
@Component({
	selector: "app-date-picker",
	templateUrl: "./date-picker.component.html",
	styleUrls: ["./date-picker.component.scss"],
})
export class DatePickerComponent implements OnInit {
	loading = false;
	@Input() planId;
	editItem: Reserve;
	pickerValue;
	dateTimePicker = {};

	timeInputForm: FormGroup;
	constructor(
		public popoverController: PopoverController,
		private fb: FormBuilder,
		private global: GlobalService,
		public navParams: NavParams,
		private screenSize: ScreensizeService
	) {
		this.timeInputForm = this.fb.group({
			reserve_day: [""],
			from: ["", Validators.compose([Validators.required])],
			to: ["", Validators.compose([Validators.required])],
		});
	}
	ngOnInit() {
		this.editItem = this.navParams.get("editItem");
		if (this.editItem) {
			this.setFormData();
		}
		const desktopView = this.screenSize.isDesktop;
		if (desktopView) {
			this.dateTimePicker = {
				enterAnimation: pickerAnimation.enterAnimation,
				leaveAnimation: pickerAnimation.leaveAnimation,
			};
		}
	}

	setFormData() {
		this.pickerValue = this.editItem["reserve_day"];
		Object.keys(this.timeInputForm.controls).forEach((field) => {
			const control = this.timeInputForm.get(field);
			control.setValue(this.editItem[field]);
		});
	}

	confirmDate() {
		if (this.timeInputForm.valid) {
			const dateValue = this.timeInputForm.get("reserve_day").value;
			const toClock = this.timeInputForm.get("to").value;
			const fromClock = this.timeInputForm.get("from").value;
			if (this.editItem) {
				this.addPlanTime(dateValue, fromClock, toClock, this.editItem.id);
			} else {
				this.addPlanTime(
					dateValue,
					this.getClock(fromClock),
					this.getClock(toClock)
				);
			}
		} else {
			this.global.showToast('زمان شروع و پایان الزامی است !', 2000, 'top', 'danger')
		}
	}
	getClock(clock: string) {
		if (clock.length != 0) {
			const clockArray = clock.split("T");
			const realClock = clockArray[1].split(".");
			return realClock[0];
		} else {
			return clock;
		}
	}

	addPlanTime(reserveDay, from, to, editId?) {
		this.loading = true;
		const options = {
			plan_id: this.planId,
			reserve_day: reserveDay,
			from: from,
			to: to,
		};
		if (editId) {
			options["id"] = editId;
		}
		this.global
			.httpPost(
				this.editItem ? "profile/editPlanTime" : "profile/addPlanTime",
				options
			)
			.subscribe(
				(res) => {
					this.popoverController.dismiss(res);
					if (res.msg) {
						this.global.showToast(res.msg, 2000, "top");
					}
					this.loading = false;
				},
				(err) => {
					this.loading = false;
					this.global.showError(err);
				}
			);
	}
}
