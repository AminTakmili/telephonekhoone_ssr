import { VoiceMessageComponent } from './show/voice-message/voice-message.component';
import { ChatOptionsComponent } from './mobile/show/chat-options/chat-options.component';
import { MobileShowComponent } from './mobile/show/show.component';
import { MobileComponent } from './mobile/mobile.component';
import { VoiceComponent } from './show/voice/voice.component';
import { ShowComponent } from './show/show.component';
import { ConversationPage } from './conversation.page';

import { PipesModule } from './../module/pipes-module/pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ShareModulePageModule } from '../module/share-module/share-module.module';
import { ConversationPageRoutingModule } from './conversation-routing.module';
import { AutosizeModule } from 'ngx-autosize';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConversationPageRoutingModule,
    ShareModulePageModule,
    AutosizeModule,
    ReactiveFormsModule,
    PipesModule
  ],
  declarations: [
    // ConversationSampleComponent,
    ConversationPage,
    ShowComponent,
    VoiceComponent,
    VoiceMessageComponent,
     MobileComponent,
     MobileShowComponent,
    ChatOptionsComponent,
  ],
})
export class ConversationPageModule {}
