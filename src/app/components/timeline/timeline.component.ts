import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
    @Input() timeLine;
    @Input() planId;
    constructor(
        private modalController: ModalController,
        private global: GlobalService
    ) {}

    ngOnInit() {}

    dismiss() {
        this.modalController.dismiss();
    }

    reserveItem(item) {
        this.global
            .showAlert(
                'رزرو نوبت',
                `رزرو نوبت برای ${item.reserve_day} از ساعت ${item.from} تا ${item.to} اطمینان دارید ؟`,
                [
					{
                        text: 'تایید',
                        handler: () => {
                            this.reserveItemRequest(item);
                        },
                    },
                    {
                        text: 'بی خیال',
                        role: 'cancel',
                    },
                    
                ]
            )
            .then((al) => {
                al.present();
            });
    }
    reserveItemRequest(item) {
        this.global.showLoading().then(() => {
            this.global
                .httpPost('requestCall', {
                    plan_id: this.planId,
                    reserve_id: item.id,
                })
                .subscribe(
                    (res) => {
                        this.global.dismisLoading()
                    },
                    (err) => {
                        this.global.dismisLoading()
                        this.global.showError(err).then((val) => {
                            if (val === 'req') {
                                this.reserveItemRequest(item);
                            }
                        });
                    }
                );
        });
    }
}
