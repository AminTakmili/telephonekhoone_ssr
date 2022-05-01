import {
	Component,
	ElementRef,
	HostListener,
	OnInit,
	ViewChild,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { IonInput, IonTextarea, NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import {
	ChatData,
	WebSocketService,
} from 'src/app/services/web-socket.service';
import { Storage } from '@ionic/storage';
import * as jalaali from 'moment-jalaali';
// import { Files } from 'src/app/models/files.model';
import { map, take } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import * as _ from "lodash";
import { ChatService } from 'src/app/services/chat.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
	selector: 'app-show',
	templateUrl: './show.component.html',
	styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
	@ViewChild('chatBox') private chatBox: ElementRef;
	@ViewChild('messageInput', { static: false }) messageInput;
	@ViewChild('fileInput', { static: false }) fileInput;
	breadCrumb = [
		{ url: '/', name: 'صفحه نخست' },
		{ url: '/categories', name: 'دسته بندی' },
	];
	created_at = '';
	notFoundMsg = 'موردی یافت نشد';
	clock_created_at = '';
	chatMessages = [];
	isTyping = false;
	messageText = '';
	typingTimeout: any = null;
	limit = 10;
	offset = 0;
	loading = false;
	chatData: any;
	scrolltop: number = null;
	notPaid = false;
	imTyping = false;
	showScrollBtn = false;
	selectedFiles = [];
	recording: boolean = false;
	payLoading = false;
	chatId: number
	offlineSubscription$

	constructor(
		private socketService: WebSocketService,
		public global: GlobalService,
		private activatedRoute: ActivatedRoute,
		private storage: Storage,
		private navCtrl: NavController,
		private chatService: ChatService,
		private iab: InAppBrowser,
	) { }



	@HostListener('document:keypress', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		const key = event.key;
		if (event.code === 'Enter' && event.code !== key && !this.loading) {
			this.sendMessage();
		}
	}

	ionViewDidEnter() {
		this.loading = true;
		this.chatId = parseInt(this.activatedRoute.snapshot.paramMap.get('chat-id'));
		this.getRoomData();

	}

	getRoomData() {
		this.global
			.httpPost('chats/show', {
				id: this.chatId,
				limit: this.limit,
				offset: this.offset,
			}).subscribe(data => {
				this.chatData = data;
				if (this.chatData.status === 'pending') {
					this.notPaid = true;
					this.loading = false;
				} else if (this.chatData.status === 'paid' || this.chatData.status === 'in_chat') {
					this.notPaid = false;
					this.socketService.disconnect('chat');
					this.socketService.connectSocket(
						this.global.getUserInfo().id.toString(),
						data.id
					);
					this.joinOrCreate();
					this.chatService.setConnectedSocket(data.id);
				} else {
					this.getOfflineData(data);
				}
			});
	}

	ngOnInit() { }
	toggleRecording(data) {
		this.recording = data;
	}


	getOfflineData(res) {
		this.chatMessages = [];
		this.loading = false;
		if (res.msg) {
			this.notFoundMsg = res.msg;
		} else {
			this.chatMessages = res.messages;
			setTimeout(() => {
				this.scrollToBottom();
			}, 100);
		}
	}

	endChat() {
		this.global
			.showAlert(
				'پایان گفتگو',
				'برای پایان دادن به این گفتگو اطمینان دارید ؟',
				[
					{
						text: 'تایید',
						handler: () => {
							this.socketService.emit('finishChat', 'chat');
						},
					},
					{
						text: 'بی خیال',
						role: 'cancel',
					},

				]
			)
			.then((alert) => {
				alert.present();
			});
	}

	finishChatRequest() {
		const chatId = this.chatId;
		this.global.showLoading().then((loader) => {
			this.global
				.httpPost('chats/end', {
					id: chatId,
				})
				.subscribe(
					(res) => {
						this.global.showToast(
							res.msg,
							2000,
							'top'
						);
						this.chatData.status = res.status;
						this.chatData.status_text =
							res.status_text;
						this.chatService.changeStatus(chatId, res.status, res.status_text);
						this.chatMessages.push({
							message: 'گفتگو پایان یافت',
							type: 'alert',
						});
						this.global.dismisLoading()
					},
					(err) => {
						this.global.dismisLoading()
						this.global.showError(err);
					}
				);
		});
	}

	joinOrCreate() {
		this.chatMessages = [];
		this.socketService.emit('joinOrCreateChat', 'chat');
		this.socketService
			.listen('joinSuccessChat', 'chat')
			.subscribe((firms: ChatData) => {
				const jalaliDate = this.getJalaliDate(firms.chat.createdAt);
				this.loading = false;

				this.created_at = jalaliDate.date;
				this.clock_created_at = jalaliDate.time;

				this.chatMessages = firms.chat.messages;
				this.chatMessages.push({
					message: `${firms.msg}`,
					type: 'alert',
				});
				setTimeout(() => {
					this.scrollToBottom();
				}, 0);
			});
		this.socketService
			.listen('joinErrorChat', 'chat')
			.subscribe((firms) => {
				console.log(firms);
			});
		// file listens
		this.socketService
			.listen('fileSuccessChat', 'chat')
			.subscribe((firms: any) => {
				firms.map(fileItem => {
					this.chatMessages.push(fileItem);
				});
				this.selectedFiles = [];

				setTimeout(() => {
					this.scrollToBottom();
				}, 0);
			});
		this.socketService
			.listen('fileFailChat', 'chat')
			.subscribe((firms) => {
				console.log(firms);
			});
		// file listens end
		this.socketService
			.listen('messageSuccessChat', 'chat')
			.subscribe((firms) => {
				this.chatMessages.push(firms);
				setTimeout(() => {
					this.scrollToBottom();
				}, 0);
			});
		this.socketService
			.listen('messageFailChat', 'chat')
			.subscribe((firms) => {
				console.log(firms);
			});

		this.socketService
			.listen('receiveMessageChat', 'chat')
			.subscribe((firms) => {
				this.chatMessages.push(firms);
				setTimeout(() => {
					this.scrollToBottom();
				}, 0);
			});
		this.socketService
			.listen('receiveFileChat', 'chat')
			.subscribe((firms) => {
				this.chatMessages.push(firms[0]);
				setTimeout(() => {
					this.scrollToBottom();
				}, 0);
			});
		this.socketService
			.listen('userIsTypingChat', 'chat')
			.subscribe((firms: any) => {

				this.isTyping = firms.isTyping;
			});
		this.socketService
			.listen('joinMemberChat', 'chat')
			.subscribe((firms: any) => {
				this.chatMessages.push({
					message: `${firms.name} وارد گفتگو شد`,
					type: 'alert',
				});
				setTimeout(() => {
					this.scrollToBottom();
				}, 0);
			});
		this.socketService
			.listen('finishChat', 'chat')
			.subscribe((firms: any) => {
				console.log(firms);
				if (firms) {
					if (this.global.getUserType().value === 'consultant') {
						this.finishChatRequest();
					} else {
						this.finishedChat();
					}
				}
			});
		this.socketService
			.listen('failedFinishChat', 'chat')
			.subscribe((firms: any) => {
				console.log(firms);

			});
	}

	typingUser() {
		if (!this.imTyping) {
			this.socketService.emit('iAmTypingChat', 'chat');
			this.imTyping = true;
		}
		clearTimeout(this.typingTimeout);
		this.typingTimeout = setTimeout(() => {
			this.imTyping = false;
			this.socketService.emit('doneTypingChat', 'chat');
		}, 1000);
	}

	sendMessage() {
		if (this.messageText !== '') {
			this.socketService.emit('sendMessageChat', 'chat', {
				text: this.messageText,
			});
			this.messageText = '';
		}
	}

	async sendFiles() {
		if (this.selectedFiles.length !== 0) {
			let filesArray = [];
			this.selectedFiles.map(file => {
				const myFile = {
					media: file.apiResponse,
					fileType: file.fileType
				}
				filesArray.push(myFile);
			});
			await this.socketService.emit('sendFileChat', 'chat', filesArray);
			this.fileInput.nativeElement.value = '';
		}
	}

	async sendVoice(voice) {
		let filesArray = [];
		const myFile = {
			media: voice,
			fileType: 'voice'
		}
		filesArray.push(myFile);
		await this.socketService.emit('sendFileChat', 'chat', filesArray);
	}

	scrollToBottom() {
		this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
	}

	getJalaliDate(date) {
		const splitDate = date.split(' ');
		return {
			time: jalaali(splitDate[1], 'HH:mm:ss').format('HH:mm'),
			date: jalaali(splitDate[0], 'YYYY-M-D').format('jYYYY/jM/jD'),
		};
	}


	onChatBoxScroll(ev) {
		const scrollPosition = ((ev.target as HTMLElement).scrollHeight - (ev.target as HTMLElement).scrollTop) - 418;
		if (scrollPosition > 10) {
			this.showScrollBtn = true;
		} else {
			this.showScrollBtn = false;
		}
	}

	openFile(event) {
		let input = event.target;
		if (input.files.length !== 0) {
			Object.keys(input.files).map((key, index) => {
				const element = input.files[key];
				const myFiles = {
					loading: true,
					file: element,
					loadPercent: 0,
					fileType: 'file',
					id: new Date().getTime() + _.random(10000, 99999),
					apiResponse: null
				}
				this.selectedFiles.push(myFiles);
				this.uploadImage(myFiles);
			});
		}
	}

	uploadImage(item) {
		const formData = new FormData;
		formData.append('file', item.file);
		formData.append('key', item.file.name);
		item.req = this.global.httpUpload('chats/saveFile', formData).pipe(
			map((event) => {
				if (event.type === HttpEventType.UploadProgress) {
					const percentDone = Math.round(100 * event.loaded / event.total);
					return { status: 'progress', message: percentDone };
				}
				if (event.type === HttpEventType.Response) {
					return event.body;
				}
			}),
		).subscribe(res => {
			if (res) {
				if (!res.path) {
					item.loadPercent = res.message;
				} else {
					item.apiResponse = res;
					item.loading = false;
					this.fileInput.nativeElement.value = null;
				}
			}
		}, err => {
			item.loading = false;
			this.global.showError(err);
		})
	};

	removeFile(item) {
		const fileIndex = this.selectedFiles.indexOf(item);
		this.selectedFiles.splice(fileIndex, 1);
		item.req.unsubscribe();
	}

	ionViewWillLeave() {
		if (this.offlineSubscription$) {
			this.offlineSubscription$.unsubscribe();
		}
	}
	finishedChat() {
		this.chatMessages.push({
			message: 'گفتگو از سمت مشاور پایان یافت',
			type: 'alert',
		});
		const chatId = this.chatId;
		this.chatData.status = 'ended';
		this.chatData.status_text = 'پایان یافته';
		this.chatService.changeStatus(chatId, 'ended', 'پایان یافته');

	}
	cancelChat() {
		const chatId = this.chatId;
		this.global.httpPost('chats/cancel', {
			id: chatId
		}).subscribe(res => {
			this.global.showToast(res.msg, 2000, 'top');
			this.chatData.status = res.status;
			this.chatData.status_text = res.status_text;
			this.chatService.changeStatus(chatId, res.status, res.status_text);
			this.notPaid = false;
			this.getOfflineData(chatId);
		}, err => {
			this.global.showError(err);
		});
	}

	back() {
		this.navCtrl.navigateBack('/conversation/mobile');
	}

	paymentMethod(method) {
		this.payLoading = true;
		this.global.httpPost('chats/pay', {
			id: this.chatData.id,
			type: method,
			back_url: this.global.backUrl
		}).subscribe(res => {
			this.global.showToast(res.msg, 2000, 'top');
			if (method === 'online') {
				// this.navCtrl.navigateForward('/payment');
				this.iab.create(
					res.link,
					'_self'
				);
			}

			this.payLoading = false;
		}, err => {
			this.global.showError(err);
			this.payLoading = false;
		});
	}

	checkUploading() {
		let loadingFile = _.find(this.selectedFiles, 'loading');
		return loadingFile ? true : false;
	}

	showImage(img) {
		return img.options?.subSizes?.medium ?? img.path;
	}

}
