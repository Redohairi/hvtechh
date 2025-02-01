import { Routes } from '@angular/router';
import { HomeComponent } from '../app/home.component'; 
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductFormComponent } from './products/product-form/product-form.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductFormComponent },
  { path: 'products', component: ProductListComponent, pathMatch: 'full' },
];
