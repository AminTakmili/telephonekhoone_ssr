import { GlobalService } from 'src/app/services/global.service';
import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from "@angular/core";
import { IonSearchbar } from "@ionic/angular";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
	selector: "app-blog-side",
	templateUrl: "./blog-side.component.html",
	styleUrls: ["./blog-side.component.scss"],
})
export class BlogSideComponent implements OnInit {
	@ViewChild("search", { static: false }) searchBar: IonSearchbar;
	@Output() searchEmitter = new EventEmitter<string>();
	@Input() data;
	@Input() loading;
	@Input() isBlog: boolean;
	_loading = true;
	constructor(
	private	global:GlobalService
	) { }

	ngOnInit() {
		this.global.SSRsetTimeout(() => {
			this.searchBar.ionChange
				.pipe(debounceTime(1000))
				.pipe(distinctUntilChanged())
				.subscribe(() => {
					this.searchEmitter.emit(this.searchBar.value);
				});
		}, 100);
	}

	ngOnChanges(changes) {
		console.log(this.data);
		console.log(changes);
		this._loading = changes.loading.currentValue;
	}

}
