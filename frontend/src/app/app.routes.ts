import { provideRouter, Route } from '@angular/router';

import { RoleGuard } from './role.guard';
import { DialogGuard } from './dialog.guard';
import { ProfileGuard } from './profile.guard';

import { LayoutComponent } from './layout/layout.component';


export const routes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./shared/home/home.component').then(m => m.HomeComponent),
        title: 'Home'
      },
      {
        path: 'products',
        loadComponent: () => import('./shared/products/products.component').then(m => m.ProductsComponent),
        title: 'Products'
      },
      {
        path: 'products/:productId',
        loadComponent: () => import('./user/product-details/product-details.component').then(m => m.ProductDetailsComponent)
      },

      {
        path: 'login',
        loadComponent: () => import('./shared/login/login.component').then(m => m.LoginComponent),
        canActivate: [DialogGuard],
        title: 'Login'
      },
      {
        path: 'register',
        loadComponent: () => import('./user/register/register.component').then(m => m.RegisterComponent),
        canActivate: [DialogGuard],
        title: 'Register'
      },
      {
        path: 'basket',
        loadComponent: () => import('./checkout/basket/basket.component').then(m => m.BasketComponent),
        title: 'Basket'
      },
      {
        path: 'account',
        loadComponent: () => import('./user/account/account.component').then(m => m.AccountComponent),
        canActivate: [ProfileGuard],
        title: 'Account',
        children: [
          {
            path: 'profile',
            loadComponent: () => import('./user/profile/profile.component').then(m => m.ProfileComponent),
            title: 'Profile'
          }
        ]
      },
      {
        path: 'checkout',
        loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent)
      },
      {
        path: 'admin',
        canActivate: [RoleGuard],
        children: [
          {
            path: 'home',
            loadComponent: () => import('./shared/home/home.component').then(m => m.HomeComponent)
          },
          {
            path: 'products',
            loadComponent: () => import('./shared/products/products.component').then(m => m.ProductsComponent),
            title: 'Products'
          },
          {
            path: 'users',
            loadComponent: () => import('./admin/user-list/user-list.component').then(m => m.UserListComponent),
            title: 'Users'
          },
          {
            path: 'comments',
            loadComponent: () => import('./admin/comment-management/comment-management.component').then(m => m.CommentManagementComponent),
            title: 'Comments'
          }
        ]
      }
    ]
  }
];

export const appRouterProviders = [
  provideRouter(routes)
];
