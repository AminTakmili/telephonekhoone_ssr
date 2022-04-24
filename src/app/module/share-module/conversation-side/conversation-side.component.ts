import { Component, Input, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/chat.model';
import { GlobalService } from 'src/app/services/global.service';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { ModalController } from '@ionic/angular';
import { SurveyComponent } from '../survey/survey.component';
@Component({
	selector: 'app-conversation-side',
	templateUrl: './conversation-side.component.html',
	styleUrls: ['./conversation-side.component.scss'],
})
export class ConversationSideComponent implements OnInit {
	chats = [];
	@Input() loading;
	@Input() activeChatId;
	@Input() isMobile;
	constructor(public global: GlobalService, private chatService: ChatService, private modalController: ModalController) {
		this.chatService.chatsList.subscribe(res => {
			if (res) {
				this.chats = res;
				const activeChat = this.chats.find(x => x.id === parseInt(this.activeChatId, 10));
				if (activeChat) {
					this.setChatData(activeChat);
				}
			}
		})
	}

	ngOnInit() { }

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


	async showSurvey(item) {
		const modal = await this.modalController.create({
			component: SurveyComponent,
			cssClass: 'survey-modal',
			componentProps: { id: item.id , type: 2 }
		});
		await modal.present();
	}

	loadData(ev) {
	}

}
