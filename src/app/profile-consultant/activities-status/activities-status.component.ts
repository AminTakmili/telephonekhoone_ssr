import {Component, OnInit} from '@angular/core';
import {GlobalService} from 'src/app/services/global.service';

@Component({
    selector: 'app-activities-status',
    templateUrl: './activities-status.component.html',
    styleUrls: ['./activities-status.component.scss'],
})
export class ActivitiesStatusComponent implements OnInit {
    loading = false;
    video_call = this.global.getUserInfo().is_video_call === 1;
    voice_call = this.global.getUserInfo().is_voice_call === 1;
    chat = this.global.getUserInfo().is_chat === 1;
    breadCrumb = [{url: '/', name: 'صفحه نخست'}];

    constructor(private global: GlobalService) {
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.video_call = this.global.getUserInfo().is_video_call === 1;
        this.voice_call = this.global.getUserInfo().is_voice_call === 1;
        this.chat = this.global.getUserInfo().is_chat === 1;
    }

    changeStatus() {
        this.loading = true;
        this.global
            .httpPost('profile/updateActivityStatus', {
                is_video_call: this.video_call ? 1 : 0,
                is_voice_call: this.voice_call ? 1 : 0,
                is_chat: this.chat ? 1 : 0,
            })
            .subscribe(
                (res) => {
                    this.global.showToast(res.msg, 2000, 'top', 'success');
                    this.loading = false;
                    this.global.getUserInfo().is_video_call = this.video_call ? 1 : 0;
                    this.global.getUserInfo().is_voice_call = this.voice_call ? 1 : 0;
                    this.global.getUserInfo().is_chat = this.chat ? 1 : 0;
                },
                (err) => {
                    this.loading = false;
                    this.global.showError(err);
                }
            );
    }
}
