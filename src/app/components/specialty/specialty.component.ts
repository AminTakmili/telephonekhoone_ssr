import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController } from '@ionic/angular';
import { Category } from 'src/app/models/categories.model';

@Component({
	selector: 'app-specialty',
	templateUrl: './specialty.component.html',
	styleUrls: ['./specialty.component.scss'],
})
export class SpecialtyComponent implements OnInit {
	//   @Input() categories: Category[]
	@ViewChild('childCategory') childCategory: IonSelect;
	@ViewChild('parentCategory') parentCategory: IonSelect;
	_categories: Category[];
	get categories(): Category[] {
		return this._categories;
	}
	@Input() set categories(value: Category[]) {
		this._categories = value;
	}

	@Input() selectedCategory;
	@Input() selectedChildes;
	alertInterFace = {
		cssClass: 'selectCategorySignUp'
	}
	showError = false;
	constructor(private modalCtrl: ModalController) { }

	ngOnInit() {
		if (this.childCategory) {
			this.childCategory.value = this.selectedChildes;
		}
		if (this.selectedCategory && this.parentCategory) {
			this.parentCategory.value = this.selectedCategory.id;
		}
	}

	changeCat(val) {
		this._categories.map((x) => {
			if (x.id == val.value) {
				this.selectedCategory = x;
			}
		});
		this.childCategory.value = [];
	}

	confirm() {
		if (this.selectedCategory && this.childCategory.value?.length != 0) {
			this.showError = false;
			this.modalCtrl.dismiss({
				parent: this.selectedCategory,
				children: this.childCategory.value,
			});
		} else {
			this.showError = true;
		}
	}

	cancle() {
		this.modalCtrl.dismiss();
	}
}
