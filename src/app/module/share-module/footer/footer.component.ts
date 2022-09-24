import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
	public enamad = '';
	public logo = '';
	constructor(public global: GlobalService) { }

	ngOnInit() {
		this.global.enamad.subscribe(res => {
			if (res) {
				this.enamad = res;
			}
		});
		this.global.logo.subscribe(res => {
			if (res) {
				console.log(res);
				this.logo = res;
			}
		});
	}

}
