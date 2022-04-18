import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class WebSocketService {
	socket = {
		chat: undefined,
	};

	readonly url = 'https://chat.telephonkhoneh.com/chat';

	constructor() { }

	connectSocket(userId, chatId) {
		this.socket.chat = io.io(`${this.url}`, {
			query: {
				"user_id": userId,
				"chat_id": chatId,
			},
			transports: ['polling']
		});

		this.socket.chat.on('connect_error', (error) => {
			console.log(error);
		});
	}

	listen(eventName: string, request: string) {
		
		return new Observable((subscriber) => {
			this.socket[request].on(eventName, (data: ChatData) => {
				subscriber.next(data);
			});
		});
	}

	emit(eventName: string, request: string, data?: any) {
		this.socket[request].emit(eventName, data);
	}

	disconnect(request: string) {
		if (this.socket[request]) {
			this.socket[request].disconnect();
			this.socket[request].on('disconnected', (data) => {
				console.log('client disconnected');
			});
		}
	}

	reconnect(request: string) {
		this.socket[request].connect();
	}
}

export interface ChatData {
	msg: string;
	chat: any;
}
