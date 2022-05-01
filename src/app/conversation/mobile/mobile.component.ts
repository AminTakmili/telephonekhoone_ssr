import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SurveyComponent } from 'src/app/module/share-module/survey/survey.component';
import { ChatService } from 'src/app/services/chat.service';
import { GlobalService } from 'src/app/services/global.service';
import { Chat } from '../../models/chat.model';
@Component({
	selector: 'app-mobile',
	templateUrl: './mobile.component.html',
	styleUrls: ['./mobile.component.scss'],
})
export class MobileComponent implements OnInit {
	chats: Chat[] = [];
	limit = 100;
	offset = 0;
	emptyPage = true;
	archiveLoading = false;
	refreshLoading = false;
	activeChatId: number;
	isMobile = false;
	activeChatData: any;
	constructor(private modalController: ModalController, private activatedRoute: ActivatedRoute,
		private chatService: ChatService, public global: GlobalService) { }
	ionViewWillEnter() {
		this.activeChatId = this.activatedRoute.snapshot?.children[0]?.params['chat-id'];
		this.getArchive(false);
	}
	ngOnInit() {

	}
	
	async showSurvey(item) {
		const modal = await this.modalController.create({
			component: SurveyComponent,
			cssClass: 'survey-modal',
			componentProps: { id: item.id , type: 2 }
		});
		await modal.present();
	}

	setChatData(value) {
		this.chatService.setChatData({
			status: value.status,
			status_text: value.status_text,
			id: value.id,
			payableAmount: value.remain_price,
			name: this.global.getUserType().value === 'consultant' ? value?.user?.fullname : value?.consultant?.fullname,
			consultant_image: value?.consultant?.image
		})
	}

	refresh(ev?) {
		this.limit = 100;
		this.offset = 0;
		this.getArchive(true, ev);
	}
	getArchive(refreshing, refresherEvent?) {
		if (!refreshing) {
			this.archiveLoading = true;
			this.chatService.chatsList.next([]);
		} else {
			this.refreshLoading = true;
		}

		this.global
			.httpPost('chats', {
				limit: this.limit,
				offset: this.offset,
			})
			.subscribe((res) => {
				refresherEvent?.target?.complete();
				this.archiveLoading = false;
				this.refreshLoading = false;
				this.chats = [];
				this.chats = res.chats.map((item) =>
					new Chat().deserialize(item)
				);
				this.chatService.chatsList.next(this.chats);
			}, err => {
				this.archiveLoading = false;
				this.refreshLoading = false;
				this.global.showError(err);
			});
	}

}
