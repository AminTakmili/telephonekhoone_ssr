import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-voice-message',
	templateUrl: './voice-message.component.html',
	styleUrls: ['./voice-message.component.scss'],
})
export class VoiceMessageComponent implements OnInit {
	@Input() item;
	playing = false;
	voiceAudio = new Audio();
	duration = 0;
	currentTime = 0;
	constructor() { }

	ngOnInit() { }

	ngOnChanges(changes): void {
		const loadFile = new Promise<any>((resolve, reject) => {
			resolve('');
		});
		loadFile.then(async () => {

		})
		this.voiceAudio.src = this.item.medium?.path;
		this.voiceAudio.load();
		this.voiceAudio.addEventListener("loadeddata", () => {
			this.setDuration();
		});
		this.voiceAudio.addEventListener('timeupdate', () => {
			this.setCurrentTime()
		})
	}
	setDuration() {
		const duration = Math.round(this.voiceAudio.duration);
		this.duration = duration;
	}
	toggleVoice() {
		if (this.playing) {
			this.playing = false;
			this.voiceAudio.pause();
		} else {
			this.playing = true;
			this.voiceAudio.play();
		}
	}

	getMinutesAndSeconds(time) {
		const minutes = Math.floor(time / 60);
		const seconds = time - minutes * 60;
		return {
			minutes: minutes < 10 ? `0${minutes}` : minutes,
			seconds: seconds < 10 ? `0${seconds}` : seconds,
		}
	}

	setCurrentTime() {
		const currentTime = Math.round(this.voiceAudio.currentTime);
		this.currentTime = currentTime;
		if (this.currentTime === this.duration) {
			this.playing = false;
			this.currentTime = 0;
		}
	}

}
