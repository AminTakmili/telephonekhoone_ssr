import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
	selector: 'app-chat-options',
	templateUrl: './chat-options.component.html',
	styleUrls: ['./chat-options.component.scss'],
})
export class ChatOptionsComponent implements OnInit {

	constructor(private popoverController: PopoverController) { }

	ngOnInit() { }
	endChat() {
		this.popoverController.dismiss('end');
	}
}
