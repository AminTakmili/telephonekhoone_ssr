
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { IonicModule } from '@ionic/angular';
import { ShareModulePageModule } from '../module/share-module/share-module.module';

import { BlogPageRoutingModule } from './blog-routing.module';

import { BlogPage } from './blog.page';
import { ShowBlogComponent } from '../blog/show-blog/show-blog.component';
import { BlogCategoriesComponent } from './categories/categories.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlogPageRoutingModule,
    ShareModulePageModule,
    NgxPaginationModule,
    ReactiveFormsModule,
  ],
  declarations: [
    BlogPage,
    ShowBlogComponent,
    BlogCategoriesComponent,

  ],
})
export class BlogPageModule {}
