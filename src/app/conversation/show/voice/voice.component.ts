import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import * as RecordRTC from 'recordrtc';
import * as MicRecorder from 'mic-recorder-to-mp3';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService } from 'src/app/services/global.service';
import { map } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import * as _ from "lodash";

@Component({
	selector: 'app-voice',
	templateUrl: './voice.component.html',
	styleUrls: ['./voice.component.scss'],
})

export class VoiceComponent {
	@Output() recordingEmitter = new EventEmitter<boolean>();
	@Output() sendVoiceEmitter = new EventEmitter<any>();
	public record;
	public recorder: any;
	public stream: any;
	public recording = false;
	public url;
	public error;
	public voiceBlob;
	voiceTimer = 0;
	interval: any;
	totalSeconds = '00';
	totalMinutes = '00';
	constructor(private domSanitizer: DomSanitizer, private global: GlobalService) {
		this.recorder = new MicRecorder({
			bitRate: 128
		});
	}

	countUp() {
		this.interval = setInterval(() => {
			++this.voiceTimer;
			this.totalSeconds = this.pad(this.voiceTimer % 60);
			this.totalMinutes = this.pad(Math.round(this.voiceTimer / 60));
		}, 1000);
	}

	sanitize(url: string) {
		return this.domSanitizer.bypassSecurityTrustUrl(url);
	}

	initiateRecording() {
		this.setRecording(true);
		this.url = null;
		// mic to mp3
		this.recorder.start().then(() => {
			this.countUp();
		}).catch((e) => {
			console.error(e);
		});

	}


	uploadVoice(item) {
		const formData = new FormData;
		formData.append('file', item.file);
		formData.append('key', item.key);
		item.req = this.global.httpUpload('chats/saveFile', formData).pipe(
			map((event) => {
				if (event.type === HttpEventType.UploadProgress) {
					const percentDone = Math.round(100 * event.loaded / event.total);
					return { status: 'progress', message: percentDone };
				}
				if (event.type === HttpEventType.Response) {
					return event.body;
				}
			}),
		).subscribe(res => {
			if (res) {
				if (res.status === 'progress' && res.message) {
					item.loadPercent = res.message;
					if (res.message === 100) {
						item.loading = false;
					}
				} else {
					this.sendVoiceEmitter.emit(res);
					item.loading = false;
				}
			}
		}, err => {
			item.loading = false;
			this.global.showError(err);
		})
	};



	pad(val) {
		var valString = val + "";
		if (valString.length < 2) {
			return "0" + valString;
		} else {
			return valString;
		}
	}


	sendVoice() {
		this.recorder
			.stop()
			.getMp3().then(([buffer, blob]) => {
				const file = new File(buffer, `${new Date().getTime() + _.random(10000, 99999)}.mp3`, {
					type: blob.type,
					lastModified: Date.now()
				});
				this.uploadVoice({
					file: file,
					key: 'voice',
					uploadPercent: 0,
					loading: true
				});
				this.url = URL.createObjectURL(file)
				this.setRecording(false);

			}).catch((e) => {
				this.global.showAlert('خطا', 'ضبط صدای شما امکان پذیر نیست', [
					{ text: 'تایید', role: 'cancel' }
				]).then(alert => alert.present());
				console.log(e);
				this.setRecording(false);
			});
	}

	cancelVoice() {
		// this.stopRecording();
		this.setRecording(false);
		this.recorder.stop();
	}

	setRecording(recording) {
		this.recording = recording;
		this.recordingEmitter.emit(recording);
		setTimeout(() => {
			clearInterval(this.interval);
			this.voiceTimer = 0;
			this.totalSeconds = "00";
			this.totalMinutes = "00";
		}, 100);
	}

}
