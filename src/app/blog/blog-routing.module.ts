import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogPage } from './blog.page';
import { ShowBlogComponent } from '../blog/show-blog/show-blog.component';
import { BlogCategoriesComponent } from './categories/categories.component';

const routes: Routes = [
  {
    path: '',
    component: BlogPage,
  },
  {
    path: ':id',
    component: ShowBlogComponent,
  },
  {
    path: 'categories/:id',
    component: BlogCategoriesComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogPageRoutingModule {}
