import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { NewMediaComponent } from './new-media/new-media.component';

// export interface MediaItems {

// }

@Component({
	selector: 'app-media',
	templateUrl: './media.component.html',
	styleUrls: ['./media.component.scss'],
})
export class MediaComponent implements OnInit {
	breadCrumb = [{ url: '/', name: 'صفحه نخست' }];

	constructor(private modalCtrl: ModalController) { }

	ngOnInit() { }



	newMedia() {
		this.modalCtrl.create({
			component: NewMediaComponent,
		}).then(modal => {
			modal.present();
		})
	}

}
