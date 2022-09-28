import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GlobalService } from 'src/app/services/global.service';
import { SeoService } from 'src/app/services/seo.service';

@Component({
    selector: 'app-tickets',
    templateUrl: './tickets.component.html',
    styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {
    breadCrumb = [
        { url: '/', name: 'صفحه نخست' },
        { url: '/profile', name: 'پروفایل' },
        { url: '/profile/tickets', name: 'پشتیبانی' },
        { url: '/profile/tickets/new', name: 'درخواست جدید' },
    ];

    constructor(
        private navCtrl: NavController,
        private global: GlobalService,
        private storage: Storage,
        public seo: SeoService,

    ) {
    }

    end = false;
    tickets = [];
    loading = false;
    limit = 10;
    offset = 0;

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
        this.getTickets(false);
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
        console.log(data);
        this.seo.generateTags({
            title: data.metaTitle,
            description: data.metaDescription,
            canonical: data.canonicalLink,
            keywords: data.metaKeywords.toString(),
            image: '/assets/img/icon/icon-384x384.png',
            isNoIndex: data.isNoIndex,
        });
    }

    newTicket() {
        this.navCtrl.navigateRoot('/pages/more/tickets/new');
    }

    getTickets(isLoadmore): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!isLoadmore) {
                this.loading = true;
                this.tickets = [];
                this.offset = 0;
                this.end = false;
            }

            this.global
                .httpPost('support/index', {
                    limit: this.limit,
                    offset: this.offset,
                })
                .subscribe(
                    (res) => {
                        this.loading = false;
                        res.map((item) => {
                            const tick = {} as tickets;
                            tick.subject = item.subject;
                            tick.created_at = item.created_at;
                            tick.id = item.id;
                            tick.status = item.status;
                            tick.status_id = item.status_id;
                            this.tickets.push(tick);
                        });
                        if (res.length < this.limit) {
                            this.end = true;
                        }
                        resolve('');
                    },
                    (err) => {
                        this.global.showError(err);
                        this.loading = false;
                        resolve('');
                    }
                );
        });
    }

    loadData(event) {
        if (this.end === false) {
            this.offset += this.limit;
            this.getTickets(true).then(() => {
                event.target.complete();
            });
        } else {
            event.target.complete();
        }
    }

    goDetail(item) {
        this.storage.set('ticketTitle', item.subject);
        this.navCtrl.navigateRoot('/pages/more/tickets/show/' + item.id);
    }
}

interface tickets {
    status: string;
    subject: string;
    id: number;
    created_at: string;
    status_id: number;
}
