import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { Timeline } from 'src/app/classes/Consultant';
import { DatePickerComponent } from 'src/app/components/date-picker/date-picker.component';
import { PlanDetailComponent } from 'src/app/components/plan-detail/plan-detail.component';
import { Reserve } from 'src/app/models/reserve.model';
import { GlobalService } from 'src/app/services/global.service';
import * as pickerAnimation from 'src/app/animations/picker';
import { SeoService } from 'src/app/services/seo.service';

@Component({
	selector: 'app-reservation',
	templateUrl: './reservation.component.html',
	styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {

	loading = false;
	page = 'plans';
	limit = 10;
	selectedPlanId: any;
	offset = 0;
	plans: Plans[] = [];
	reserveItems: Reserve[] = [];
	reserves: Timeline[] = [];
	breadCrumb = [{ url: '/', name: 'صفحه نخست' }];

	constructor(
		private popoverController: PopoverController,
		public global: GlobalService,
		private modalController: ModalController,
		public seo: SeoService,
	) { }

	async showDatePicker(item?: Reserve) {
		const popover = await this.popoverController.create({
			component: DatePickerComponent,
			cssClass: 'date-popover',
			//   event: ev,
			translucent: true,
			componentProps: {
				planId: this.selectedPlanId,
				editItem: item,
			},
		});
		await popover.present();
		popover.onDidDismiss().then((data) => {
			const myData = data?.data?.item;
			if (myData) {
				if (myData.id) {
					const itemIndex = this.reserveItems.findIndex(
						(x) => x.id == myData.id
					);
					if (itemIndex != -1) {
						this.reserveItems.splice(itemIndex, 1, myData);
					} else {
						const date = new Reserve().deserialize(myData);
						this.reserveItems.unshift(date);
					}
				}
			}
		});
	}

	ngOnInit() {
		this.getPlanData();
		this.setSeo(
			{
				metaTitle: 'تلفن خونه',
				metaDescription: ' تلفن خونه',
				metaKeywords: ', تلفن خونه,  مشاوره',
				isNoIndex: true
			}
		)
	}
	ionViewWillEnter() {
		this.setSeo(
			{
				metaTitle: 'تلفون خونه',
				metaDescription: ' تلفن خونه',
				metaKeywords: ', تلفن خونه,  مشاوره',
				isNoIndex: true
			}
		)
	}


	getPlanData() {
		this.loading = true;
		this.global
			.httpPost('profile/plans', {
				limit: this.limit,
				offset: this.offset,
			})
			.subscribe(
				(res) => {
					res.map((item) => {
						const plans = {} as Plans;
						plans.description = item.description;
						plans.id = item.id;
						plans.price = [];
						item.price.map((price) => {
							const prices = {} as Price;
							prices.id = price.id;
							prices.is_active = price.is_active;
							prices.name = price.name;
							prices.price = price.price;
							prices.price_extra = price.price_extra;
							prices.time = price.time;
							prices.type = price.type;
							plans.price.push(prices);
						});
						const category = {} as Category;
						category.name = item.category.name;
						category.id = item.category.id;
						category.percent = item.category.percent;
						plans.category = category;
						this.plans.push(plans);
					});

					this.loading = false;
				},
				(err) => {
					this.loading = false;
					this.global.showError(err);
				}
			);
	}

	showReserves(item) {
		this.loading = true;
		this.reserveItems = [];
		this.page = 'times';
		this.selectedPlanId = item.id;
		this.global
			.httpPost('profile/planTimes', {
				id: item.id,
				limit: this.limit,
				offset: this.offset,
			})
			.subscribe(
				(res) => {
					this.reserveItems = res.map((seminar: Reserve) =>
						new Reserve().deserialize(seminar)
					);
					this.loading = false;
				},
				(err) => {
					this.loading = false;
					this.global.showError(err);
				}
			);
	}


	backPlans() {
		this.page = 'plans';
	}

	async showDetails(item) {
		const modal = await this.modalController.create({
			component: PlanDetailComponent,
			componentProps: {
				item: item,
			},
		});

		await modal.present();
	}

	removeTimeline(item) {
		this.global
			.showAlert('حذف زمان', 'برای حذف این مورد اطمینان دارید ؟ ', [
				{
					text: 'تایید',
					handler: () => {
						item.loading = true;
						this.global
							.httpPost('profile/deletePlanTime', {
								id: item.id,
							})
							.subscribe(
								(res) => {
									item.loading = false;
									this.global.showToast(res.msg, 2000, 'top');
									const itemIndex = this.reserveItems.findIndex(
										(x) => x.id == item.id
									);
									this.reserveItems.splice(itemIndex, 1);
								},
								(err) => {
									item.loading = false;
									this.global.showError(err);
								}
							);
					},
				},
				{
					text: 'لغو',
					role: 'cancel',
				},

			])
			.then((alert) => {
				alert.present();
			});
	}
	setSeo(data) {
		console.log(data);
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

interface Plans {
	description: string;
	id: number;
	category: Category;
	price: Price[];
}

interface Category {
	id: number;
	name: string;
	percent: number;
}

interface Price {
	id: number;
	is_active: number;
	name: string;
	price: number;
	price_extra: number;
	time: number;
	type: string;
}
