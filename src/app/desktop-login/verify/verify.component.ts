import { StorageService } from './../../services/storage.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {
    NavController,
    ModalController,
    NavParams,
    IonInput,
    AlertController,
} from '@ionic/angular';
import {GlobalService} from '../../services/global.service';
import {FormBuilder} from '@angular/forms';
import {Validators, FormGroup} from '@angular/forms';
import {UserInfo} from 'src/app/classes/UserInfo';
import {ScreensizeService} from 'src/app/services/screensize.service';

@Component({
    selector: 'app-verify',
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
    timer = '02:00';
    interval: any;
    verifyForm: FormGroup;
    mobile = '';
    Inputfill = 0;
    isDesktop = false;
    isfocused = false;
    @ViewChild('codeInput', {static: false}) codeInput: IonInput;

    constructor(
        private alertController: AlertController,
        private global: GlobalService,
        private navCtrl: NavController,
        public modalController: ModalController,
        private fb: FormBuilder,
        private navParams: NavParams,
        private deviceType: ScreensizeService,
        private StorageService: StorageService,

    ) {
        this.deviceType.isDesktopView().subscribe((res) => {
            this.isDesktop = res;
        });
        this.verifyForm = this.fb.group({
            code: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(5),
                ]),
            ],
        });
    }

    dismiss() {
        this.modalController.dismiss();
    }

    ionViewDidEnter() {
         this.global.SSRclearInterval(this.interval);
        this.countdown();
        this.mobile = this.navParams.get('phone');
        this.codeInput.getInputElement().then((input) => {
            input.focus();
        });
    }

    ionViewDidLeave() {
         this.global.SSRclearInterval(this.interval);
        // localStorage.removeItem('verifyCart');
    }

    checkFocus() {
        this.isfocused = true;
    }

    checkBlur() {
        this.isfocused = false;
    }

    codeChange() {
        if (this.verifyForm.get('code').value.length === 5) {
            this.Inputfill = 6;
            this.onVerify();
        }
        if (this.verifyForm.get('code').value.length === 0) {
            this.Inputfill = 1;
        }
        if (this.verifyForm.get('code').value.length === 1) {
            this.Inputfill = 2;
        }
        if (this.verifyForm.get('code').value.length === 2) {
            this.Inputfill = 3;
        }
        if (this.verifyForm.get('code').value.length === 3) {
            this.Inputfill = 4;
        }
        if (this.verifyForm.get('code').value.length === 4) {
            this.Inputfill = 5;
        }
    }

    countdown() {
        let countDownDate: any = new Date();
        countDownDate.setMinutes(countDownDate.getMinutes() + 2);
        countDownDate = countDownDate.getTime();
        this.interval = this.global.SSRsetInterval(() => {
            const now = new Date().getTime();
            const distance = countDownDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                this.global.SSRclearInterval(this.interval);
                this.timer = '00:00';
            } else {
                this.timer = `0${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            }
        }, 1000);
    }

    reSend() {
        this.global.showLoading().then(() => {
            this.global
                .httpPost('sendVerifyCode', {
                    mobile: this.mobile,
                })
                .subscribe(
                    (res) => {
                        this.global.showToast(res.msg, 2000, 'top');
                        this.global.dismisLoading()            
                        this.timer = '02:00';
                        this.countdown();
                        setTimeout(() => {
                            this.codeInput.getInputElement().then((input) => {
                                input.focus();
                            });
                            this.Inputfill = 1;
                        }, 100);
                    },
                    (error) => {
                        this.global.dismisLoading()             
                        this.global.showError(error);
                    }
                );
        });
    }

    ngOnInit() {
    }

    onVerify() {
        if (this.verifyForm.valid) {
            this.global.showLoading().then(() => {
                this.global
                    .httpPost('checkVerifyCode', {
                        mobile: this.mobile,
                        verify_code: this.verifyForm.get('code').value,
                    })
                    .subscribe(
                        (res) => {
                            this.global.dismisLoading()
                            const userInfo = new UserInfo();
                            (userInfo.mobile = this.mobile),
                                (userInfo.name = res.fullname),
                                (userInfo.id = res.id),
                                this.global.setToken(res.token);

                             this.StorageService.set('userInfo', JSON.stringify(userInfo));

                            if (res.fullname == '') {
                                this.modalController.dismiss(2);
                            } else {
                                this.global.changeLogin(true);
                                 this.StorageService.set('isLogin', 'true');
                                this.global.menuBehavior().next(true);
                                this.modalController.dismiss(1);
                            }
                        },
                        async (error) => {
                            this.global.dismisLoading()
                            if (error.status === 500 || error.status === 400) {
                                const alert = await this.alertController.create({
                                    header: 'خطا',
                                    message: error.error.msg,
                                    buttons: [
                                        {
                                            text: 'بستن',
                                            role: 'cancel',
                                        },
                                    ],
                                });
                                alert.onDidDismiss().then(() => {
                                    {
                                        this.verifyForm.reset();
                                        setTimeout(() => {
                                            this.codeInput.getInputElement().then((input) => {
                                                input.focus();
                                            });
                                            this.Inputfill = 1;
                                        }, 100);
                                    }
                                });
                                await alert.present();
                            }
                        }
                    );
            });
        }
    }
}
