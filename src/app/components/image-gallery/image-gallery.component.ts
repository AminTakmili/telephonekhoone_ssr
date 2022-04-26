import { GlobalService } from 'src/app/services/global.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
	IonSlide,
	IonSlides,
	ModalController,
	NavParams,
} from '@ionic/angular';

@Component({
	selector: 'app-image-gallery',
	templateUrl: './image-gallery.component.html',
	styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit {
	@Input() index;
	@Input() galleryImages;
	@ViewChild('detailSlider', { static: false }) detailSlider: IonSlides;
	comingImages;
	images = [];
	showSlider = false;
	detailSliderOptions = {
		preloadImages: false,
		slidesPerView: 1,
		initialSlide: 0,
		spaceBetween: 20,
		// effect: 'fade',
		zoom: true,
		observer: true,
		autoplay: {
			delay: 5000,
		},
		lazy: {
			loadPrevNext: true,
			loadPrevNextAmount: 1,
		},
	};
	constructor(
		private modalController: ModalController,
		private global: GlobalService
	) {
	}

	close() {
		this.modalController.dismiss();
	}

	ionViewDidEnter() {
		const index = this.index;
		this.detailSliderOptions.initialSlide = index;
		this.global.SSRsetTimeout(() => {
			this.showSlider = true;
		}, 50);
	}

	ngOnInit() {
		this.galleryImages.map(item => {
			this.images.push({
				path: item,
				loading: false
			})
		})
	}
}
