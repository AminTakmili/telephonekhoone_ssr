import { NotLoginGuard } from './guards/notLogin.guard';
import { ConsultantGuard } from './guards/consultant.guard';
import { LoginGuard } from './guards/login.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  {
		path: '',
		loadChildren: () =>
			import('./home/home.module').then((m) => m.HomePageModule),
	},
  {
		path: 'about',
		loadChildren: () =>
			import('./about/about.module').then((m) => m.AboutPageModule),
	},
  {
		path: 'contact-us',
		loadChildren: () =>
			import('./contact-us/contact-us.module').then(
				(m) => m.ContactUsPageModule
			),
	},
  {
		path: 'blog',
		loadChildren: () =>
			import('./blog/blog.module').then((m) => m.BlogPageModule),
	},
	{
		path: 'help',
		loadChildren: () =>
			import('./help/help.module').then((m) => m.HelpPageModule),
	},
	{
		path: 'media',
		loadChildren: () => import('./media/media.module').then(m => m.MediaPageModule)
	},
	{
		path: 'webinar',
		loadChildren: () =>
			import('./webinar/webinar.module').then((m) => m.WebinarPageModule),
	},
	{
		path: 'rules',
		loadChildren: () => import('./rules/rules.module').then( m => m.RulesPageModule)
	  },
  {
    path: 'c',
    loadChildren: () => import('./categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
	path: 'login',
	loadChildren: () =>
		import('./login/login.module').then((m) => m.LoginPageModule),
	canActivate: [LoginGuard],
	},
	{
		path: 'sign-up',
		loadChildren: () =>
			import('./sign-up/sign-up.module').then((m) => m.SignUpPageModule),
			 canActivate: [NotLoginGuard],
	},
	{
		path: 'profile-consultant',
		loadChildren: () =>
			import('./profile-consultant/profile-consultant.module').then(
				(m) => m.ProfileConsultantPageModule
			),
		canActivate: [ConsultantGuard],
	},


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabledBlocking' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
