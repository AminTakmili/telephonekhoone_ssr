import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ShareModulePageModule } from '../module/share-module/share-module.module';
import { ConversationPageRoutingModule } from './conversation-routing.module';

import { ConversationPage } from './conversation.page';
import { ShowComponent } from './show/show.component';
import { AutosizeModule } from 'ngx-autosize';
import { PipesModule } from '../module/pipes-module/pipes/pipes.module';
import { VoiceComponent } from './show/voice/voice.component';
import { VoiceMessageComponent } from './show/voice-message/voice-message.component';
import { MobileComponent } from './mobile/mobile.component';
import { MobileShowComponent } from './mobile/show/show.component';
import { ChatOptionsComponent } from './mobile/show/chat-options/chat-options.component';
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ConversationPageRoutingModule,
		ShareModulePageModule,
		AutosizeModule,
		PipesModule,
		
	],
	declarations: [ConversationPage, ShowComponent , VoiceComponent , VoiceMessageComponent , MobileComponent , MobileShowComponent , ChatOptionsComponent],
	// entryComponents: [ShowComponent , ConversationPage],
})
export class ConversationPageModule { }
