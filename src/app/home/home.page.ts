import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Blog, Categories } from '../classes/Blog';
import { Consultants, Prices, Searchitem } from '../classes/Categories';
import { GlobalService } from '../services/global.service';
import * as Parralax from 'parallax-js';
import { UserInfo } from '../classes/UserInfo';
import { UserBalanceService } from '../services/user-balance.service';
import { Seminars } from '../models/seminars.model';
import { IonInput, IonSearchbar } from '@ionic/angular';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('search', { static: false }) searchBar: IonInput;
  @ViewChild('parallaxScene') parallaxScene: ElementRef;
  aboutText = '';
  randomCode = (parseFloat(Math.random().toFixed(2)) * 100).toFixed(0);
  last_advice: any;
  searchLoading = false;
  showNotFound = false;
  slider_calls: number;
  searchItems = {
    blogs: [],
    consoltants: [],
  } as searchItems;
  testimonials: Testimonials[] = [];
  blogs: Blog[] = [];
  seminarItems: Seminars[] = [];
  categories: Categories[] = [];
  consultants: Searchitem[] = [];
  statistics = {
    consultants: 0,
    online_consultants: 0,
    users: 0,
  };
  support: any;
  services = [
    {
      name: 'مشاوره تلفنی  و متنی',
      image: 'assets/img/phone.png',
      desc: 'تماس با مشاورین متخصص تلفن خونه و دریافت مشاوره',
      type: 1,
      color: 'blue-light',
      link: '/c',
    },
    {
      name: ' وبینارها',
      image: 'assets/img/webinar.png',
      desc: 'وبینار های آموزشی از مشاوران تلفن خونه ',
      type: 2,
      color: 'green-light',
      link: '/webinar',
    },
    {
      name: 'رسانه',
      image: 'assets/img/social-media.png',
      desc: 'ویدیو و تصاویر مربوط به مشاوران',
      type: 3,
      color: 'red-light',
      link: '/media',
    },
  ];
  consultantOpts = {
    speed: 200,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      320: {
        slidesPerView: 1.2,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
    },
  };
  categoryOpts = {
    speed: 200,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      320: {
        slidesPerView: 1.5,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  };

  slideOpts = {
    speed: 200,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      320: {
        slidesPerView: 1.2,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  };

  slideOpts2 = {
    speed: 200,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      320: {
        slidesPerView: 1.2,
        spaceBetween: 10,
      },
      480: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  };
  commentsOpts = {
    freeMode: true,
    loop: true,
    speed: 5000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    breakpoints: {
      320: {
        slidesPerView: 1.5,
      },
      480: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
    },
  };

  constructor(
    public global: GlobalService,
    private balanceService: UserBalanceService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    public seo: SeoService,

  ) {}

  ngOnInit() {
    this.getHomeData();
    this.global.SSRsetTimeout(() => {
      this.searchBar.ionChange.subscribe((val) => {
        if (val.detail.value.length === 0) {
          this.showNotFound = false;
        }
      });
      this.searchBar.ionChange
        .pipe(debounceTime(1000))
        .pipe(distinctUntilChanged())
        .subscribe(() => {
          this.searchItem(this.searchBar.value);
        });
    }, 100);
    // this.setSeo(
    //   {
    //     metaTitle:'خانه',
    //     metaDescription:'توضیحات خانه ',
    //     canonicalLink:'wwww.telephonkhoneh.ir ',
    //     metaKeywords:'کلمات کلیدی ',
    //     image:'/src/assets/icon/favicon.png',
    //     isNoIndex:'false'
  
    //   }
    // )
  }

  gotoCategory(item) {
    console.log(item);
    // this.router.navigate(['/c'], {
    //   relativeTo: this.activateRoute,
    //   queryParams: { id: item.id },
    //   queryParamsHandling: 'merge',
    // });
    this.router.navigate(['/c' , item['_link']])
  }

  searchItem(val: any) {
    if (val.length !== 0 && !this.searchLoading) {
      this.searchItems = {
        blogs: [],
        consoltants: [],
      };
      this.searchLoading = true;

      this.global
        .httpPost('home/search', {
          search: val,
        })
        .subscribe(
          (res) => {
            // console.log(res);
            if (res.blogs) {
              res.blogs.map((blog) => {
                const b = {} as Blogs;
                b.category = blog.category;
                b.id = blog.id;
                b.title = blog.title;
                b.link = blog.seo?.link;
                this.searchItems.blogs.push(b);
              });
            }

            if (res.consultants) {
              res.consultants.map((consultant) => {
                const c = {} as Consoltants;
                c.category = consultant.category;
                c.fullname = consultant.fullname;
                c.category_item_id = consultant.category_item_id;
                c.category_item_link = consultant.category_item_link;
                c.id = consultant.id;
                c.link = consultant.seo?.link;
                this.searchItems.consoltants.push(c);
              });
            }
            this.searchLoading = false;
            this.showNotFound = true;
          },
          (err) => {
            this.searchLoading = false;
            this.global.showError(err);
          }
        );
    } else {
      this.searchItems.blogs = [];
      this.searchItems.consoltants = [];
    }
  }

  ionViewDidEnter() {
    const paraScene = this.parallaxScene.nativeElement;
    const parralaxInstance = new Parralax(paraScene).limit(50, 50);
  }

  clearSearch() {
    this.searchBar.value = '';
    this.searchItems.consoltants = [];
    this.searchItems.blogs = [];
    this.showNotFound = false;
  }

  swiperOption = {
    autoplay: {
      delay: 5000,
    },
    speed: 2000,
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          let tx = -offset$$1;
          if (!swiper.params.virtualTranslate) {
            tx -= swiper.translate;
          }
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          slides.transitionEnd(() => {
            if (eventTriggered) {
              return;
            }
            if (!swiper || swiper.destroyed) {
              return;
            }
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    },
  };

  generateRandom() {
    this.global.SSRsetInterval(() => {
      const num = (parseFloat(Math.random().toFixed(2)) * 100).toFixed(0);
      this.randomCode = num;
    }, this.slider_calls);
  }

  getHomeData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.seminarItems = [];
      this.global.showLoading().then(() => {
    //     loader ? loader.present() : '';

        //  this.global.showLoading().then()
        this.global.httpGet('home').subscribe(
          (res) => {
            console.log(res);
            if (res.enamad) {
              this.global.setEnamad(res.enamad);
            }
            this.slider_calls = res.slider_calls;

            this.last_advice = res.last_advice;
            if (res.user) {
              this.balanceService.setUserBalance(res.user.balance);
            }
            this.aboutText = res.about;
            res.blogs.map((blog) => {
              const bl = new Blog();
              bl.created_at = blog.created_at;
              bl.id = blog.id;
              bl.link = blog.seo?.link;
              bl.title = blog.title;
              if (blog.media[0]) {
                bl.media =
                  blog.media[0].options?.subSizes.large ?? blog.media[0].path;
              }
              bl.category = blog.category;
              this.blogs.push(bl);
            });
            res.categories.map((cat) => {
              const category = new Categories();
              category.name = cat.name;
              category.id = cat.id;
              category.link = cat.seo?.link;
              category.entity_count = cat.entity_count;
              // console.log(cat.media.options.subSizes);

              if (cat.media) {
                category.media = cat.media.options.subSizes;
              }
              this.categories.push(category);
            });
            res.consultants.map((item) => {
              console.log(item);
              const list = new Searchitem();
              list.id = item.id;
              list.link = item.seo?.link;
              list.country = item.country;
              list.fullname = item.fullname;
              list.id = item.id;
              list.image = item.image;
              list.is_online = item.is_online;
              list.consultations = item.consultations;
              list.category_item_id = item.category_item_id;
              list.category_item_link = item.category_item_link;
              // list.prices = [];
              // item.prices.map((val) => {
              //   const price = new Prices();
              //   price.id = val.id;
              //   price.is_active = val.is_active;
              //   price.name = val.name;
              //   price.price = val.price;
              //   price.price_extra = val.price_extra;
              //   price.time = val.time;
              //   price.type = val.type;
              //   list.prices.push(price);
              // });
              list.rate = item.rate;
              list.title = item.title;
              this.consultants.push(list);
              const userInfo = new UserInfo();
              // userInfo.avatar =
            });
            res.testimonials.map((cm) => {
              const comment = {} as Testimonials;
              comment.created_at = cm.created_at;
              comment.description = cm.description;
              comment.media =
                cm.media.options.subSizes.medium ??
                cm.media.options.subSizes.thumbnail ??
                cm.media.path;
              comment.name = cm.name;
              this.testimonials.push(comment);
            });
            if (res.user) {
              this.global.setBadges(res.user.chats_count, res.user.calls_count);
              this.global.setUserInfo(res.user);
            }
            this.seminarItems = res.seminars.map((seminar: Seminars) =>
              new Seminars().deserialize(seminar)
            );

            // console.log(res.seminars);
            
            this.setSeo(
              {
                metaTitle:res['seo_information'].title,
                metaDescription:res['seo_information'].description,
                metaKeywords:res['seo_information'].keywords,
                isNoIndex:false

              }
            )

            this.statistics = res.statistics;
            this.support = res.support;
            // loader ? loader.dismiss() : '';
            this.global.dismisLoading()
            resolve('');
            this.generateRandom();
          },
          (err) => {
            // loader ? loader.dismiss() : '';
            this.global.dismisLoading()
            this.global.showError(err).then((data) => {
              if (data == 'req') {
                this.getHomeData();
              }
            });
          }
        );
      });
    });
  }

  
  setSeo(data) {
  
    this.seo.generateTags({
        title: data.metaTitle,
        description: data.metaDescription,
        keywords: data.metaKeywords,
        image: 'src/assets/img/seo-logo.png',
        isNoIndex: data.isNoIndex,
    });
    
  }

}

interface Testimonials {
  created_at: string;
  description: string;
  name: string;
  media: any;
}

interface Blogs {
  category: string;
  id?: number;
  link: number;
  title: string;
}

interface Consoltants {
  category: string;
  category_item_id?: number;
  category_item_link: string;
  fullname: string;
  id?: number;
  link: string;
}

interface searchItems {
  blogs: Blogs[];
  consoltants: Consoltants[];
}
