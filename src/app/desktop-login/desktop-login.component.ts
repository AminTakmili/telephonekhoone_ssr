import {Component, OnInit, ViewChild} from '@angular/core';
import {
    NavController,
    ModalController,
    IonInput,
    Platform,
} from '@ionic/angular';
import {GlobalService} from '../services/global.service';

import {FormBuilder} from '@angular/forms';
import {Validators, FormGroup} from '@angular/forms';
import {ValidateMobile} from '../validators/mobile.validator';
import {VerifyComponent} from './verify/verify.component';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {UserInfo} from '../classes/UserInfo';

@Component({
    selector: 'app-desktop-login',
    templateUrl: './desktop-login.component.html',
    styleUrls: ['./desktop-login.component.scss'],
})
export class DesktopLoginComponent implements OnInit {
    registerForm: FormGroup;
    loginForm: FormGroup;
    client: string;
    register = false;
    loading = false;
    rulesChecked = false;
    @ViewChild('tel', {static: false}) tel: IonInput;

    constructor(
        private navCtrl: NavController,
        private global: GlobalService,
        public modalController: ModalController,
        private platform: Platform,
        private fb: FormBuilder,
        private iab: InAppBrowser
    ) {
        this.registerForm = this.fb.group({
            name: ['', Validators.compose([Validators.required])],
            companyName: ['', Validators.compose([])],
        });
        this.loginForm = this.fb.group({
            mobile: [
                '',
                Validators.compose([
                    Validators.required,
                    ValidateMobile,
                    Validators.minLength(11),
                    Validators.maxLength(11),
                ]),
            ],
        });
    }

    ngOnInit() {
        this.platform.ready().then(() => {
            this.client = this.platform.platforms()[1];
        });
    }

    ionViewWillEnter() {
        // if (this.global.isLoginBehavior().value) {
        //     this.navCtrl.navigateRoot('/tabs/dailyprice');
        // }
        this.global.removeToken();
        this.loginForm.reset();
    }

    ionViewDidEnter() {
        this.tel.getInputElement().then((input) => {
            input.focus();
        });
    }

    ionViewWillLeave() {
        localStorage.removeItem('loginCart');
    }

    dismissModal(data?) {
        this.modalController.dismiss(data);
    }

    async onLogin() {
        if (this.loginForm.valid) {
            this.loading = true;
            this.global
                .httpPost('checkMobileNumber', {
                    mobile: this.loginForm.get('mobile').value,
                })
                .subscribe(
                    async (res) => {
                        this.loading = false;
                        const modal = await this.modalController.create({
                            component: VerifyComponent,
                            componentProps: {
                                phone: this.loginForm.get('mobile').value,
                            },
                        });
                        modal.onDidDismiss().then((data) => {
                            console.log(data.data);

                            if (data.data === 1) {
                                setTimeout(() => {
                                    this.dismissModal('req');
                                }, 200);
                            } else if (data.data === 2) {
                                this.register = true;
                            }
                        });
                        await modal.present();
                    },
                    (error) => {
                        this.loading = false;
                        this.global.showError(error);
                    }
                );
        }
    }

    async registerData() {
        this.global.validateAllFormFields(this.registerForm);
        if (this.registerForm.get('name').valid) {
            if (this.rulesChecked) {
                this.global.showLoading().then(() => {
                    this.global
                        .httpPost('register', {
                            fullname: this.registerForm.get('name').value,
                            companyname: this.registerForm.get('companyName').value,
                        })
                        .subscribe(
                            async (res) => {
                                this.global.showToast(res.msg, 2000, 'top');
                                this.global.dismisLoading()
                                const userInfo = new UserInfo();
                                (userInfo.mobile = this.global.getUserInfo().mobile),
                                    (userInfo.name = this.registerForm.get('name').value),
                                    (userInfo.id = this.global.getUserInfo().id);
                                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                                this.global.changeLogin(true);
                                localStorage.setItem('isLogin', 'true');
                                this.global.menuBehavior().next(true);
                                this.navCtrl.navigateForward('/');
                                setTimeout(() => {
                                    this.dismissModal('req');
                                }, 200);
                            },
                            (error) => {
                                this.global.dismisLoading()
                                this.global.showError(error);
                            }
                        );
                });
            } else {
                this.global.showToast('مطالعه قوانین الزامی است !', 2000, 'top');
            }
        }
    }

    showRules() {
        let link = 'http://localhost:8100/law';
        const browser = this.iab.create(link);
    }
}
