import {Component, OnInit} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {GlobalService} from 'src/app/services/global.service';

@Component({
    selector: 'app-favourites',
    templateUrl: './favourites.component.html',
    styleUrls: ['./favourites.component.scss'],
})
export class FavouritesComponent implements OnInit {
    favouritesList = [];
    loading = false;
    limit = 10;
    offset = 0;
    breadCrumb = [
        {url: '/', name: 'صفحه نخست'},
        {url: '/profile', name: 'پروفایل'},
        {url: '/profile/favourites', name: 'علاقه مندی ها'},
    ];

    constructor(
        private global: GlobalService,
        private alertController: AlertController
    ) {
    }

    ngOnInit() {
        this.getData();
    }

    async removeFavourite(item) {
        const alert = await this.alertController.create({
            header: 'حذف مشاور',
            message: `${item.consultant.fullname} از لیست مشاوران مورد علاقه شما حذف شود ؟ `,
            buttons: [
                {
                    text: 'بله حذف شود',
                    handler: () => {
                        item.loading = true;
                        this.global
                            .httpPost('removeFavorite', {
                                id: item.id,
                            })
                            .subscribe(
                                (res) => {
                                    this.global.showToast(res.msg, 2000, 'top', 'success');
                                    const itemIndex = this.favouritesList.findIndex(
                                        (x) => x.id == item.id
                                    );
                                    this.favouritesList.splice(itemIndex, 1);
                                },
                                (err) => {
                                    item.loading = false;
                                    this.global.showError(err);
                                }
                            );
                    },
                },
                {
                    text: 'لغو',
                    role: 'cancle',
                },
            ],
        });

        await alert.present();
    }

    getData() {
        this.loading = true;
        this.global
            .httpPost('favorites', {
                limit: this.limit,
                offset: this.offset,
            })
            .subscribe(
                (res) => {
                    res.map((item) => {
                        const favItem = {} as FavouritesList;
                        favItem.id = item.id;
                        favItem.loading = false;
                        const consultant = {} as Consultant;
                        consultant.category = item.consultant.category;
                        consultant.fullname = item.consultant.fullname;
                        consultant.media = item.consultant.media;
                        favItem.consultant = consultant;
                        this.favouritesList.push(favItem);
                    });
                    this.loading = false;
                },
                (err) => {
                    this.loading = false;
                    this.global.showError(err);
                }
            );
    }
}

interface FavouritesList {
    id: number;
    consultant: Consultant;
    loading: boolean;
}

interface Consultant {
    category: string;
    fullname: string;
    media: any;
}
