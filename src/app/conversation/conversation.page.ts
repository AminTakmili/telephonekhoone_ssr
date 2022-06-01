import { Component, OnInit } from '@angular/core';
import { Chat } from '../models/chat.model';
import { GlobalService } from '../services/global.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { NavController } from '@ionic/angular';
import { ChatService } from '../services/chat.service';
import { SeoService } from '../services/seo.service';
@Component({
	selector: 'app-conversation',
	templateUrl: './conversation.page.html',
	styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit {
	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/conversation', name: 'گفتگوی متنی' },
	];
	chats: Chat[] = [];
	limit = 10;
	offset = 0;
	emptyPage = true;
	archiveLoading = false;
	refreshLoading = false;
	activeChatId: number;
	isMobile = false;
	activeChatData: any;

	constructor(
		private global: GlobalService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private navCtrl: NavController,
		private chatService: ChatService,
		private mediaMatcher: MediaMatcher,
		public seo: SeoService,

		) {
			
		const mediaQueryList = mediaMatcher.matchMedia('(max-width: 768px)');
		this.isMobile = mediaQueryList.matches;
		mediaQueryList.addEventListener('change', (ev) => {
			this.isMobile = ev.matches;
			if (ev.matches) {
				this.navCtrl.navigateRoot('/conversation/mobile');
			} else {
				this.navCtrl.navigateRoot('/conversation');
			}
		});
	}

	ionViewWillEnter() {
		this.setEmptyPage(this.global.getUrl().sections[2]);
		this.router.events.subscribe((ev) => {
			if (ev instanceof NavigationEnd) {
				const location = ev.url.split('/');
				this.setEmptyPage(location[2]);
			}
		});
		this.activeChatId = this.activatedRoute.snapshot?.children[0]?.params['chat-id'];
		
			this.setSeo(
				{
				  metaTitle:'گفتگوی متنی',
				  metaDescription:'گفتگوی متنی در تلفن خونه',
				  metaKeywords:'گفتگوی متنی,گفتگوی متنی تلفن خونه, گفتگوی متنی با مشاوره',
				  isNoIndex:false
	
				}
				)
		  
	}

	setSeo(data) {
		// console.log(data);
	  this.seo.generateTags({
		  title: data.metaTitle,
		  description: data.metaDescription,
		  canonical: data.canonicalLink,
		  keywords: data.metaKeywords.toString(),
		  image: '/assets/img/icon/icon-384x384.png',
		  isNoIndex: data.isNoIndex,
	  });
	  
  }


	setEmptyPage(value) {
		if (value) {
			this.emptyPage = false;
		} else {
			this.emptyPage = true;
		}
	}

	ngOnInit() {
		this.getArchive(false);
		this.setSeo(
			{
			  metaTitle:'گفتگوی متنی',
			  metaDescription:'گفتگوی متنی در تلفن خونه',
			  metaKeywords:'گفتگوی متنی,گفتگوی متنی تلفن خونه, گفتگوی متنی با مشاوره',
			  isNoIndex:false

			}
			)
	}

	getArchive(refreshing) {
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
				this.archiveLoading = false;
				this.refreshLoading = false;
				this.chats = [];
				this.chats = res.chats.map((item) =>
					new Chat().deserialize(item)
				);
				this.chatService.chatsList.next(this.chats);
			});
	}

	refresh() {
		this.limit = 10;
		this.offset = 0;
		this.getArchive(true);
	}
}
