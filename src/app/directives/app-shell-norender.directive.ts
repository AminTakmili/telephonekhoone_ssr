import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Directive, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewContainerRef } from "@angular/core";
// import { LoadingService } from "../services/loading.service";

@Directive({
    selector: '[appShellNoRender]'
})
export class AppShellNoRenderDirective implements OnInit{

    constructor(
        @Inject(PLATFORM_ID) private platformId,
        private templateRef:TemplateRef<any>,
        private viewContainer : ViewContainerRef,
        // private loadingService : LoadingService

        ){
            console.log(isPlatformBrowser(this.platformId));

            // console.log(this.loadingService);
            // console.log(this.templateRef);
            // console.log(this.viewContainer);
            // console.log(this.viewContainer.element.nativeElement);
            // console.log(isPlatformBrowser(this.platformId));
    }

    ngOnInit(){
        
        if(isPlatformBrowser(this.platformId)){
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
        else{
            this.viewContainer.clear();
            // this.loadingService.containerLoading.subscribe((x)=>{
            //     if(x){
            //         this.viewContainer.createEmbeddedView(this.templateRef);
            //     }else{
            //         this.viewContainer.clear();
            //     }
            // });
        }

    }

}