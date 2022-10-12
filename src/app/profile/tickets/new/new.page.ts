import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {GlobalService} from 'src/app/services/global.service';
import { SeoService } from 'src/app/services/seo.service';
import {ValidateMobile} from 'src/app/validators/mobile.validator';

@Component({
    selector: 'app-new',
    templateUrl: './new.page.html',
    styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {

    ticketForm: FormGroup;
    loading = false;
    breadCrumb = [
        {url: '/', name: 'صفحه نخست'},
        {url: '/profile', name: 'پروفایل'},
        {url: '/profile/tickets', name: 'مکالمات من'},
    ];

    constructor(
        private global: GlobalService,
        private fb: FormBuilder,
        private navCtrl: NavController,
        private seo: SeoService,
    ) {
        this.ticketForm = this.fb.group({
            subject: ['', Validators.compose([Validators.required])],
            message: ['', Validators.compose([Validators.required])],
        });
    }

    ngOnInit() {
        this.setSeo(
            {
                metaTitle: 'پشتیبانی',
                metaDescription: 'پشتیبانی به تلفن خونه',
                metaKeywords: 'پشتیبانی,پشتیبانی تلفن خونه, پشتیبانی مشاوره',
                isNoIndex: true

            }
        )
    }

    setSeo(data) {
        this.seo.generateTags({
            title: data.metaTitle,
            description: data.metaDescription,
            canonical: data.canonicalLink,
            // keywords: data.metaKeywords.toString(),
            image: '/assets/img/icon/icon-384x384.png',
            isNoIndex: data.isNoIndex,
        });
    }

    submitReq() {
        if (!this.loading) {
            this.loading = true;
            this.global
                .httpPost('support/add', {
                    support_statuses: 3,
                    subject: this.ticketForm.get('subject').value,
                    message: this.ticketForm.get('message').value,
                })
                .subscribe(
                    (res) => {
                        this.loading = false;
                        this.navCtrl.navigateRoot('/profile/tickets');
                    },
                    (err) => {
                        this.loading = false;
                        this.global.showError(err);
                    }
                );
        }
    }
}
