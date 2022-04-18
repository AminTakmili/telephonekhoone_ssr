import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ChatData {
	status: string;
	status_text: string;
	name: string;
	id: number;
	payableAmount: number;
	consultant_image: any;
}
@Injectable({
	providedIn: 'root'
})
export class ChatService {
	public chatData = new BehaviorSubject<ChatData>(null);
	public chatsList = new BehaviorSubject<any>([]);
	public connectedSocket: number;
	constructor() { }

	setChatData(data: ChatData) {
		this.chatData.next(data);
	}

	checkSocketConnected(chatId) {
		return chatId === this.connectedSocket;
	}

	setConnectedSocket(chatId) {
		this.connectedSocket = chatId;
	}

	setChatsList(list) {
		this.chatsList.next(list);
	}

	changeStatus(id, status, status_text) {
		const myItem = this.chatsList.value.find(x => x.id == id);
		myItem.status = status;
		myItem.status_text = status_text;
	}

	setChatDataById(id) {
		const item = this.chatsList.value.find(x => x.id === id);
		this.setChatData(item);
	}
}

