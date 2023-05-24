import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {IonContent} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {GlobalService} from 'src/app/services/global.service';
import { SeoService } from 'src/app/services/seo.service';

@Component({
    selector: 'app-show',
    templateUrl: './show.page.html',
    styleUrls: ['./show.page.scss'],
})
export class ShowPage implements OnInit {
    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        const key = event.key;
        if (event.code == 'Enter' && event.code != key && !this.loading) {
            this.sendMessage();
        }
    }

    breadCrumb = [
        {url: '/', name: 'تلفن خونه'},
        {url: '/profile', name: 'پروفایل'},
        {url: '/profile/tickets', name: 'مکالمات من'},
        {url: '/profile/tickets/show', name: 'مشاهده درخواست'},
    ];
    loading = false;
    replayForm: FormGroup;
    myId;
    messages = [];
    title = '';
    @ViewChild('content', {static: false}) content: IonContent;
    @ViewChild('chat', {static: false}) chat: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        public global: GlobalService,
        private fb: FormBuilder,
        private storage: Storage,
        private seo: SeoService,
    ) {
        this.replayForm = this.fb.group({
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

    ionViewWillEnter() {
        this.myId = this.activatedRoute.snapshot.paramMap.get('id');
        this.getData(this.myId);
        this.storage.get('ticketTitle').then((val) => {
            this.title = val;
        });
    }

    setSeo(data) {
        console.log(data);
        this.seo.generateTags({
            title: data.metaTitle,
            description: data.metaDescription,
            canonical: data.canonicalLink,
            // keywords: data.metaKeywords.toString(),
            image: '/assets/img/icon/icon-384x384.png',
            isNoIndex: data.isNoIndex,
        });
    }

    ionViewDidLeave() {
        this.storage.remove('ticketTitle');
    }

    sendMessage() {
        if (this.replayForm.valid) {
            this.loading = true;
            this.global
                .httpPost('support/sendMessage', {
                    support_id: this.myId,
                    message: this.replayForm.get('message').value,
                })
                .subscribe(
                    (res) => {
                        this.loading = false;
                        // const message = new Messages();
                        // message.id = res.id;
                        // message.createdAt = res.createdAt;
                        // message.isAdmin = res.isAdmin;
                        // message.message = res.message;
                        this.messages.push(res);
                        setTimeout(() => {
                            this.replayForm.reset();
                            this.content.scrollToBottom(200);
                            this.chat.scrollToBottom(200);
                        }, 200);
                    },
                    (error) => {
                        this.loading = false;
                        this.global.showError(error);
                    }
                );
        }
    }

    getData(id) {
        this.global.showLoading().then(() => {
            this.global
                .httpPost('support/detail', {
                    id: id,
                })
                .subscribe(
                    (res) => {
                        res.map((item) => {
                            this.messages.push(item);
                        });
                       this.global.dismisLoading();
                        setTimeout(() => {
                            this.content.scrollToBottom(200);
                        }, 200);
                    },
                    (err) => {
                       this.global.dismisLoading();
                        this.global.showError(err);
                    }
                );
        });
    }
}
