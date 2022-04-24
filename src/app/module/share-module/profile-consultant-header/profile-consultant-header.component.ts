import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-consultant-header',
  templateUrl: './profile-consultant-header.component.html',
  styleUrls: ['./profile-consultant-header.component.scss'],
})
export class ProfileConsultantHeaderComponent implements OnInit {
	galleryThumbsConfig = {
		spaceBetween: 0,
		slidesPerView: 'auto',
		freeModeSticky: true,
		slideToClickedSlide: true,
		freeMode: true,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,

	};
  constructor() { }

  ngOnInit() {}

}
