import { RouterModule } from '@angular/router';
import { AppShellNoRenderDirective } from './../../directives/app-shell-norender.directive';
import { AppShellRenderDirective } from './../../directives/app-shell-render.directive';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { ShareModulePageRoutingModule } from "./share-module-routing.module";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderTypeTwoComponent } from "./header-type-two/header-type-two.component";
import { BlogSideComponent } from "./blog-side/blog-side.component";
import { ProfileHeaderComponent } from "./profile-header/profile-header.component";
import { ProfileConsultantHeaderComponent } from "./profile-consultant-header/profile-consultant-header.component";
import { ConversationSideComponent } from "./conversation-side/conversation-side.component";
// // components
import { SpecialtyComponent } from "../../components/specialty/specialty.component";
import { VerifyComponent } from "src/app/desktop-login/verify/verify.component";
import { ShareModulePage } from "./share-module.page";
import { DesktopLoginComponent } from "src/app/desktop-login/desktop-login.component";
 import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { ValidatorModule } from "src/app/components/validator/validator.module";
import { CountriesPopoverComponent } from "src/app/components/countries-popover/countries-popover.component";
 import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NgPersianDatepickerModule } from "ng-persian-datepicker";
import { DatePickerComponent } from "src/app/components/date-picker/date-picker.component";
import { WalletComponent } from "src/app/components/wallet/wallet.component";
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
 import { SelectedFilesComponent } from 'src/app/profile-consultant/media/new-media/selected-files/selected-files.component';
import { UploadFileComponent } from 'src/app/components/upload-file/upload-file.component';
import { SurveyComponent } from './survey/survey.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { ImageGalleryComponent } from 'src/app/components/image-gallery/image-gallery.component';
import { RulesPage } from 'src/app/rules-component/rules.page';
import { PipesModule } from '../pipes-module/pipes/pipes.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NgPersianDatepickerModule,
		IonicModule,
		RouterModule,
		ReactiveFormsModule,
		ValidatorModule,
		CKEditorModule,
		PipesModule
	],
	providers: [InAppBrowser],
	declarations: [
		ShareModulePage,
		HeaderComponent,
		FooterComponent,
		HeaderTypeTwoComponent,
		DesktopLoginComponent,
		BlogSideComponent,
		ProfileHeaderComponent,
		ProfileConsultantHeaderComponent,
		ConversationSideComponent,
		SpecialtyComponent,
		VerifyComponent,
		CountriesPopoverComponent,
		DatePickerComponent,
		WalletComponent,
		NotFoundComponent,
		SelectedFilesComponent,
		UploadFileComponent,
		SurveyComponent,
		StarRatingComponent,
		ImageGalleryComponent,
		AppShellRenderDirective,
		AppShellNoRenderDirective,
		RulesPage

	],
	entryComponents: [SpecialtyComponent],
	exports: [
		HeaderComponent,
		FooterComponent,
		HeaderTypeTwoComponent,
		DesktopLoginComponent,
		BlogSideComponent,
		ProfileHeaderComponent,
		ProfileConsultantHeaderComponent,
		ConversationSideComponent,
		VerifyComponent,
		//  ReactiveFormsModule,
		ValidatorModule,
		CountriesPopoverComponent,
		CKEditorModule,
 		NgPersianDatepickerModule,
		DatePickerComponent,
		WalletComponent,
		NotFoundComponent,
		SelectedFilesComponent,
		UploadFileComponent,
		AppShellRenderDirective,
		AppShellNoRenderDirective,
		// PipesModule,
		RulesPage
	],
	
})
export class ShareModulePageModule { }
