// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from '../app/home.component'; 
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'products/new', component: ProductFormComponent, canActivate: [AuthGuard] },
  { path: 'products/edit/:id', component: ProductFormComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductListComponent, pathMatch: 'full',canActivate: [AuthGuard] },
];
