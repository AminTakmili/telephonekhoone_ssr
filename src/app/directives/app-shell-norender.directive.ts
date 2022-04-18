import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Directive, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewContainerRef } from "@angular/core";
import { LoadingService } from "../services/loading.service";

@Directive({
    selector: '[appShellNoRender]'
})
export class AppShellNoRenderDirective implements OnInit{

    constructor(
        @Inject(PLATFORM_ID) private platformId,
        private templateRef:TemplateRef<any>,
        private viewContainer : ViewContainerRef,
        private loadingService : LoadingService

        ){

    }

    ngOnInit(){
        if(isPlatformBrowser(this.platformId)){
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
        else{
            this.viewContainer.clear();
            this.loadingService.containerLoading.subscribe((x)=>{
                if(x){
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }else{
                    this.viewContainer.clear();
                }
            });
        }

    }

}