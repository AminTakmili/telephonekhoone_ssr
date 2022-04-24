import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-star-rating',
	templateUrl: './star-rating.component.html',
	styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent implements OnInit {
	@Output('onChange') onChange: EventEmitter<any> = new EventEmitter();
	@Input() rate;
	constructor() { }

	ngOnInit() { }

	changeRate(rate) {
		this.onChange.emit(rate)
	}

}
