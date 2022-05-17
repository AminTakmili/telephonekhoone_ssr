import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {BlogDetail, Categories, LatestPosts} from 'src/app/classes/Blog';
import {GlobalService} from 'src/app/services/global.service';
import { SeoService } from 'src/app/services/seo.service';

@Component({
    selector: 'app-show-blog',
    templateUrl: './show-blog.component.html',
    styleUrls: ['./show-blog.component.scss'],
})
export class ShowBlogComponent implements OnInit {
    time;
    limit = 9;
    offset = 0;
    p2: 1;
    blogsCount: number;
    loading = false;
    cmLoading = false;
    myId: number;
    blogDetail: BlogDetail;
    categories: Categories[] = [];
    latest: LatestPosts[] = [];
    cmForm: FormGroup;
    blogSideData = {};
    seoObtion:object
    breadCrumb = [
        {url: '/', name: 'صفحه نخست'},
        {url: '/b', name: 'بلاگ'},
        {url: '/b', name: 'جزئیات مطلب'},
    ];

    constructor(
        public global: GlobalService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        public seo: SeoService,

    ) {
        this.cmForm = this.fb.group({
            text: ['', Validators.compose([Validators.required])],
        });
    }

    ngOnInit() {
        this.myId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
        this.getData();
     
    }
    ionViewWillEnter() {
        if (this.seoObtion!== undefined) {
            this.setSeo(this.seoObtion)
        }
    }

    onClickBack() {
        if (this.global.isBrowser) {
            window.history.back();
        }
    }

    getData() {
        this.loading = true;
        this.global.httpPost('blog/show', {id: this.myId}).subscribe(
            (res) => {
                // 
             
                this.loading = false;
                this.time = this.calculateReadingTime(res.blog.description);
                const details = new BlogDetail();
                details.admin = res.blog.admin;
                details.category_item_id = res.blog.category_item_id;
                details.comments = res.blog.comments;
                details.comments_count = res.blog.comments_count;
                details.created_at = res.blog.created_at;
                details.description = res.blog.description;
                details.id = res.blog.id;
                details.media = res.blog.media;
                details.meta_description = res.blog.meta_description;
                details.meta_keywords = res.blog.meta_keywords;
                details.meta_title = res.blog.meta_title;
                details.rate = res.blog.rate;
                details.title = res.blog.title;
                details.translations = res.blog.translations;
                details.updated_a = res.blog.updated_a;
                this.blogDetail = details;

                this.blogsCount = res.blog.comments_count;

                res.categories.map((item) => {
                    const cat = new Categories();
                    cat.entity_count = item.entity_count;
                    cat.id = item.id;
                    cat.name = item.name;
                    this.categories.push(cat);
                });
                res.latest.map((item) => {
                    const latest = new LatestPosts();
                    latest.created_at = item.created_at;
                    latest.id = item.id;
                    latest.title = item.title;
                    latest.media = item.media[0]?.options?.subSizes.medium ?? item.media[0]?.path;
                    this.latest.push(latest);
                });
                this.blogSideData = {
                    categories: this.categories,
                    latest: this.latest,
                };

                this.seoObtion={
                    metaTitle:res.blog['meta_title']?res.blog['meta_title']:'',
                    metaDescription:res.blog['meta_description']?res.blog['meta_description']:'',
                    canonicalLink:res.blog['canonicalLink']?res.blog['canonicalLink']:'',
                    metaKeywords:res.blog['meta_keywords']?res.blog['meta_keywords']:'',
                    isNoIndex:res.blog['NoIndex']?res.blog['NoIndex']:'',
                    img:this.blogDetail.media[0].path?this.blogDetail.media[0].path:'assets/img/no-image.jpg',
                }
                this.setSeo(this.seoObtion)

            },
            (err) => {
                this.global.showError(err);
            }
        );
    }

    calculateReadingTime(text) {
        const wordsPerSecond = 4;
        const textLength = text.split(' ').length;
        let result;
        if (textLength > 0) {
            const time = Math.ceil(textLength / wordsPerSecond);
            const min = Math.floor(time / 60);
            const sec = time - min * 60;
            result = {
                min: min,
                sec: sec,
            };
        }
        return result;
    }

    pageChange(ev) {
        this.latest = [];
        this.categories = [];
        this.p2 = ev;
        this.offset = (ev - 1) * this.limit;
        this.getCm();
    }

    getCm() {
    }

    submitComment() {
        this.cmLoading = true;
        this.global
            .httpPost('blog/commentAdd', {
                id: this.myId,
                description: this.cmForm.get('text').value,
            })
            .subscribe(
                (res) => {
                    this.cmLoading = false;
                    this.global.showToast(res.msg, 2000, 'top');
                },
                (err) => {
                    this.cmLoading = false;
                    this.global.showError(err);
                }
            );
    }
    setSeo(data) {
  
        this.seo.generateTags({
            title: data.metaTitle,
            description: data.metaDescription,
            canonical: data.canonicalLink,
            keywords: data.metaKeywords.toString(),
            image: data.img,
            isNoIndex: data.isNoIndex,
        });
        
    }
    
}
