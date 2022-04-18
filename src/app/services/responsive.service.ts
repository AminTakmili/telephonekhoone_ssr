import { MediaMatcher } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
	providedIn: 'root'
})
export class ResponsiveService {
	public isMobile = new BehaviorSubject<boolean>(false);
	constructor(
		mediaMatcher: MediaMatcher,
		global:GlobalService
		) {
		const mediaQueryList = mediaMatcher.matchMedia('(max-width: 768px)');
		this.isMobile.next(mediaQueryList.matches);
		if (global.isBrowser) {
			
			mediaQueryList.addEventListener('change', (ev) => {
				this.isMobile.next(ev.matches);
			});
		}
	}
}
