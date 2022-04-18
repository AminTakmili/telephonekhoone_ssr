import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    public containerLoading = new BehaviorSubject<boolean>(false);
    constructor(

    ) { }

    showLoading(){
        this.containerLoading.next(true);
    }

    dismisLoading(){
        this.containerLoading.next(false);
    }
}
