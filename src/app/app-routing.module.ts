import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'reservation',
    loadChildren: () => import('./pages/reservation/reservation.module').then( m => m.ReservationPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'table',
    loadChildren: () => import('./pages/table/table.module').then( m => m.TablePageModule)
  },
  {
    path: 'booking',
    loadChildren: () => import('./pages/booking/booking.module').then( m => m.BookingPageModule)
  },
  {
    path: 'language',
    loadChildren: () => import('./pages/language/language.module').then( m => m.LanguagePageModule)
  },
  {
    path: 'reservation',
    loadChildren: () => import('./pages/reservation/reservation.module').then( m => m.ReservationPageModule)
  },
  {
    path: 'bookingdetails',
    loadChildren: () => import('./pages/bookingdetails/bookingdetails.module').then( m => m.BookingdetailsPageModule)
  },
  {
    path: 'open-time',
    loadChildren: () => import('./pages/open-time/open-time.module').then( m => m.OpenTimePageModule)
  },
  {
    path: 'ordered',
    loadChildren: () => import('./pages/ordering/ordered/ordered.module').then( m => m.OrderedPageModule)
  },
  {
    path: 'ordered-step2',
    loadChildren: () => import('./pages/ordering/cart/ordered-step2.module').then( m => m.OrderedStep2PageModule)
  },
  {
    path: 'ordered-step3',
    loadChildren: () => import('./pages/ordering/ordered-step3/ordered-step3.module').then( m => m.OrderedStep3PageModule)
  },
  {
    path: 'detail',
    loadChildren: () => import('./pages/ordering/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'orderdetails',
    loadChildren: () => import('./pages/ordering/orderdetails/orderdetails.module').then( m => m.OrderdetailsPageModule)
  },
  {
    path: 'not-available',
    loadChildren: () => import('./pages/ordering/not-available/not-available.module').then( m => m.NotAvailablePageModule)
  },
  {
    path: 'network-error',
    loadChildren: () => import('./pages/network-error/network-error.module').then( m => m.NetworkErrorPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('./pages/signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'menudetails',
    loadChildren: () => import('./pages/menudetails/menudetails.module').then( m => m.MenudetailsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then( m => m.PagesPageModule)
  }
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
