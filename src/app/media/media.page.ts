import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
import { Categories, LatestPosts } from '../classes/Blog';
import { UserMedia } from '../models/userMedia.model';
import { GlobalService } from '../services/global.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.page.html',
  styleUrls: ['./media.page.scss'],
})
export class MediaPage implements OnInit {
  @ViewChild('consultantSearchInput', { static: false })
  consultantSearchInput: IonSearchbar;
  breadCrumb = [
    { url: '/', name: 'تلفن خونه' },
    { url: '/media', name: 'رسانه ها' },
  ];
  mediaItems = [];
  loading = false;
  limit = 10;
  blogSideData = {};
  offset = 0;
  mediaCount: number = 0;
  p2: 1;
  consultantSearchLoading = false;
  consultantSearchResult: ConsultantSearch[] = [];
  searchTitle: string = '';
  selectedConsultant: ConsultantSearch;
  searchReq: any;
  mediaReq: any;
  disableMediaReq = false;
  data:object={
	latest:[],
	categories:[]

  };
  categories: Categories[] = [];
  latest: LatestPosts[] = [];


  constructor(
	  private global: GlobalService,
	  public seo: SeoService,

	  ) {}
  getMediaData(title?: string, userId?: number, date?: string) {
    const params = {
      limit: this.limit,
      offset: this.offset,
    };
    title ? (params['title'] = title) : '';
    userId ? (params['user_id'] = userId) : '';
    date ? (params['date'] = date) : '';
    this.loading = true;
    this.mediaCount = 0;
    this.mediaItems = [];
    this.mediaReq = this.global.httpPost('media', params).subscribe(
      (res) => {
		  console.log(res);
		//   !this.data&&this.data.length==0? this.data=res: this.data=[...this.data,...res]


        this.loading = false;
        this.mediaCount = res.user_media_count;
        this.mediaItems = res.user_media.map((seminar: UserMedia) =>
          new UserMedia().deserialize(seminar)
        );
		res.categories.map((item) => {
			const cat = new Categories();
			cat.entity_count = item.entity_count;
			cat.id = item.id;
			cat.link = item.seo?.link;
			cat.name = item.name;
			this.categories.push(cat);
		});
		res.latest.map((item) => {
			console.log(item);
			const latest = new LatestPosts();
			latest.created_at = item.created_at;
			latest.id = item.seo?.link;
			latest.title = item.title;
			if (item.media&&item.media[0]) {
				latest.media = item.media[0].options?.subSizes.medium ?? item.media[0].path;
			}
			this.latest.push(latest);
		});
		this.data = {
			categories: this.categories,
			latest: this.latest,
		};
		console.log(this.data);
      },
      (err) => {
        this.loading = false;
        this.global.showError(err);
      }
    );
  }
  ngOnInit() {
    this.getMediaData();

	this.setSeo(
		{
		  metaTitle:'رسانه ها',
		  metaDescription:'رسانه های  تلفن خونه',
		  metaKeywords:'رسانه های,رسانه های تلفن خونه, رسانه های مشاوره',
		  isNoIndex:false

		}
		)
  }
  ionViewDidEnter() {

	this.setSeo(
		{
		  metaTitle:'رسانه ها',
		  metaDescription:'رسانه های  تلفن خونه',
		  metaKeywords:'رسانه های,رسانه های تلفن خونه, رسانه های مشاوره',
		  isNoIndex:false

		}
		)
  }

  pageChange(ev) {
    this.p2 = ev;
    this.offset = (ev - 1) * this.limit;
    this.getMediaData(this.searchTitle, this.selectedConsultant?.id);
  }

  searchConsultant(ev) {
    if (ev.detail.value !== this.selectedConsultant?.fullname) {
      this.disableMediaReq = false;
      if (this.searchReq) {
        this.searchReq.unsubscribe();
      }
      this.consultantSearchLoading = true;
      if (ev.detail.value) {
        this.searchReq = this.global
          .httpPost('home/findConsultant', {
            search: ev.detail.value,
          })
          .subscribe(
            (res) => {
              this.consultantSearchLoading = false;
              this.consultantSearchResult = res;
            },
            (err) => {
              this.consultantSearchLoading = false;
              this.global.showError(err);
            }
          );
      }
    }
  }
  searchMedia(ev) {
    this.searchTitle = ev.detail.value;
    this.getMediaData(this.searchTitle, this.selectedConsultant?.id);
  }

  filterByConsultant(item) {
    if (this.mediaReq) {
      this.mediaReq.unsubscribe();
    }
    this.selectedConsultant = item;
    this.consultantSearchResult = [];
    this.consultantSearchInput.value = item.fullname;
    this.disableMediaReq = true;
    this.getMediaData(this.searchTitle, this.selectedConsultant?.id);
  }

  deleteConsultant() {
    this.selectedConsultant = null;
    this.consultantSearchInput.value = '';
    this.getMediaData(this.searchTitle, this.selectedConsultant?.id);
  }
  setSeo(data) {
  console.log(data);
	this.seo.generateTags({
		title: data.metaTitle,
		description: data.metaDescription,
		canonical: data.canonicalLink,
		keywords: data.metaKeywords.toString(),
		image: '/assets/img/seo-logo.png',
		isNoIndex: data.isNoIndex,
	});

}
}

export interface ConsultantSearch {
  fullname: string;
  id: number;
}
