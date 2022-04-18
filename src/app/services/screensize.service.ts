import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

@Injectable({
	providedIn: "root",
})
export class ScreensizeService {
	private _isDesktop = new BehaviorSubject<boolean>(false);

	constructor() { }

	public get isDesktop(): boolean {
		return this._isDesktop.getValue();
	}
	public set isDesktop(val: boolean) {
		this._isDesktop.next(val);
	}
	
	onResize(size) {
		if (size < 568) {
			this._isDesktop.next(false);
		} else {
			this._isDesktop.next(true);
		}
	}

	isDesktopView(): Observable<boolean> {
		return this._isDesktop.asObservable().pipe(distinctUntilChanged());
	}
}
