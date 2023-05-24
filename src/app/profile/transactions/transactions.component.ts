import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { SeoService } from 'src/app/services/seo.service';
import { UserBalanceService } from 'src/app/services/user-balance.service';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
    limit = 10;
    offset = 0;
    transactions: Transactions[] = [];
    loading = false;
    breadCrumb = [
        { url: '/', name: 'تلفن خونه' },
        { url: '/profile', name: 'پروفایل' },
        { url: '/profile/transactions', name: 'تراکنش ها' },
    ];

    constructor(
        private global: GlobalService,
        private balance: UserBalanceService,
        public seo: SeoService,

    ) {
    }

    ngOnInit() {
        this.getTransactions();
        this.setSeo(
            {
                metaTitle: 'تراکنش ها',
                metaDescription: 'تراکنش ها در تلفن خونه',
                metaKeywords: 'تراکنش ها,تراکنش ها تلفن خونه, تراکنش ها مشاوره',
                isNoIndex: true
            }
        )
    }
    ionViewWillEnter() {
        // console.log("object");

        this.setSeo(
            {
                metaTitle: 'تراکنش ها',
                metaDescription: 'تراکنش ها در تلفن خونه',
                metaKeywords: 'تراکنش ها,تراکنش ها تلفن خونه, تراکنش ها مشاوره',
                isNoIndex: true
            }
        )
    }
    setSeo(data) {
        // console.log(data);
        this.seo.generateTags({
            title: data.metaTitle,
            description: data.metaDescription,
            canonical: data.canonicalLink,
            // keywords: data.metaKeywords.toString(),
            image: '/assets/img/icon/icon-384x384.png',
            isNoIndex: data.isNoIndex,
        });

    }


    getTransactions() {
        const global = this.global;
        this.loading = true;
        global
            .httpPost('profile/wallet', {
                limit: this.limit,
                offset: this.offset,
            })
            .subscribe(
                (res) => {
                    this.loading = false;
                    this.balance.setUserBalance(res.balance);
                    res.transactions.map((item) => {
                        const transaction = {} as Transactions;
                        transaction.amount = item.amount;
                        transaction.created_at = item.created_at;
                        transaction.description = item.description;
                        transaction.payType = item.amount < 0 ? 0 : 1;
                        this.transactions.push(transaction);
                    });
                },
                (err) => {
                    this.loading = false;
                    global.showError(err);
                }
            );
    }
}

interface Transactions {
    amount: number;
    created_at: string;
    description: string;
    payType: number;
}
