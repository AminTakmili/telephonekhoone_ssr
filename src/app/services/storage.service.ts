import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private _storage: Storage | null = null;

    constructor(
        private storage: Storage,
        @Inject(PLATFORM_ID) private platformId: Object
        ) {
        // this.init();
    }

    async init() {
        // If using, define drivers here: await this.storage.defineDriver(/*...*/);
        if (isPlatformBrowser(this.platformId)) {
            const storage = await this.storage.create();
            this._storage = storage;
        }
    }

    // Create and expose methods that users of this service can
    // call, for example:
 public async set(key: string, value: any) {
        if (isPlatformBrowser(this.platformId)) {
             await this.init();
             this._storage?.set(key, value);
            // console.log(value,key);
        }
    }

    async get(key: string) {
        if (isPlatformBrowser(this.platformId)) {
            await this.init();
            return await this._storage?.get(key);
        }
    }

    async keys() {
        if (isPlatformBrowser(this.platformId)) {
            await this.init();
            return await this._storage?.keys();
        }
    }

    async remove(key : string){
        if (isPlatformBrowser(this.platformId)) {
            await this.init();
            await this._storage?.remove(key);
        }
    }

    async clearAll(){
        if (isPlatformBrowser(this.platformId)) {
            await this.init();
            await this._storage?.clear();
        }
    }
}
